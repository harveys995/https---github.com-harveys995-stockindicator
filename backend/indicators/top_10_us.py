import yfinance as yf
import pandas as pd
from yfinance import EquityQuery

# ---------- TOP 10 UNIVERSE HELPERS ----------

def _try_etf_top_holdings(etf: str, top_n: int = 10):
    """
    Try to read top holdings from a Yahoo ETF page via yfinance.
    Returns a list of symbols or None if not available.
    """
    try:
        t = yf.Ticker(etf)
        fd = getattr(t, "funds_data", None)
        if fd is None:
            return None

        # Common shapes seen in yfinance:
        # 1) DataFrame at fd.top_holdings with column 'symbol'
        df = getattr(fd, "top_holdings", None)
        if isinstance(df, pd.DataFrame) and "symbol" in df.columns and not df.empty:
            return df["symbol"].head(top_n).dropna().tolist()

        # 2) Dict style: {'top_holdings': DataFrame}
        if isinstance(fd, dict):
            df = fd.get("top_holdings") or fd.get("holdings") or fd.get("topHoldings")
            if isinstance(df, pd.DataFrame) and "symbol" in df.columns and not df.empty:
                return df["symbol"].head(top_n).dropna().tolist()
            if isinstance(df, list) and df:
                # list of dicts: look for 'symbol' or 'holdingSymbol'
                syms = []
                for row in df:
                    sym = (row.get("symbol")
                           or row.get("holdingSymbol")
                           or row.get("ticker"))
                    if sym:
                        syms.append(sym)
                    if len(syms) >= top_n:
                        break
                return syms or None
    except Exception:
        pass
    return None


def _screener_top_us_by_mcap_strict(top_n: int = 10, take: int = 120):
    """
    Use Yahoo screener (US exchanges), then post-filter to US-domiciled EQUITY.
    This avoids ADRs. Slower because it pulls .info per ticker.
    """
    q = EquityQuery('and', [
        EquityQuery('is-in', ['exchange', 'NMS', 'NYQ']),   # NASDAQ + NYSE
        EquityQuery('eq',    ['region', 'us']),
        EquityQuery('gt',    ['lastclosemarketcap.lasttwelvemonths', 0]),
    ])
    resp = yf.screen(q,
                     sortField='lastclosemarketcap.lasttwelvemonths',
                     sortAsc=False,
                     size=take)
    symbols = [row['symbol'] for row in resp.get('quotes', [])]

    # Batch wrapper; we still loop to read .info for 'country'
    ticks = yf.Tickers(" ".join(symbols))
    us_equities = []
    for s in symbols:
        try:
            info = ticks.tickers[s].info or {}
            if info.get("quoteType") == "EQUITY" and info.get("country") == "United States":
                mcap = info.get("marketCap") or 0
                us_equities.append((s, mcap))
        except Exception:
            continue
        if len(us_equities) >= (top_n * 3):
            # we have a healthy buffer to sort
            break

    if not us_equities:
        return None

    us_equities.sort(key=lambda x: (x[1] is None, -x[1]))  # sort by mcap desc
    return [s for s, _ in us_equities[:top_n]]


def get_top10_us_by_mcap():
    """
    Robust: try ETF holdings first (SPY -> IVV -> VOO), then strict screener,
    then static fallback to keep your API alive.
    """
    for etf in ("SPY", "IVV", "VOO"):
        syms = _try_etf_top_holdings(etf)
        if syms:
            return syms

    syms = _screener_top_us_by_mcap_strict()
    if syms:
        return syms

    # Last-resort static set (still US megacaps; you can tweak)
    return ["NVDA","MSFT","AAPL","AMZN","GOOGL","META","AVGO","TSLA","BRK-B","JPM"]


# ---------- PRICES (5D) ----------

def get_5d_prices(tickers):
    """
    Return last 5 trading days of adjusted close for each ticker.
    Uses auto_adjust=True so 'Close' is adjusted (no 'Adj Close' column).
    """
    df = yf.download(
        tickers=tickers,
        period="12d",          # cover 5 sessions across weekends/holidays
        interval="1d",
        auto_adjust=True,
        group_by="ticker",
        threads=True,
        progress=False,
    )

    out = {}

    def _pick_series(sub: pd.DataFrame) -> pd.Series:
        if isinstance(sub, pd.Series):
            return sub.dropna()
        if "Close" in sub.columns:
            return sub["Close"].dropna()
        if "Adj Close" in sub.columns:
            return sub["Adj Close"].dropna()
        # fallback: last numeric column
        for c in reversed(list(sub.columns)):
            s = sub[c]
            if pd.api.types.is_numeric_dtype(s):
                return s.dropna()
        raise KeyError("No price column found")

    if isinstance(df.columns, pd.MultiIndex):
        avail = df.columns.get_level_values(0).unique()
        for t in tickers:
            if t not in avail:
                continue
            s = _pick_series(df[t])
            tail = s.tail(5)
            out[t] = [{"date": str(i.date()), "close": float(v)} for i, v in tail.items()]
    else:
        # Single ticker case
        t = tickers[0] if tickers else "TICKER"
        s = _pick_series(df)
        tail = s.tail(5)
        out[t] = [{"date": str(i.date()), "close": float(v)} for i, v in tail.items()]
    return out
