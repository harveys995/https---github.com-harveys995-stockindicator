import yfinance as yf
import pandas as pd
import numpy as np
import math

BENCH = "^GSPC"

def sharpe_5d_vs_sp500_bulk(tickers, period: str = "45d", interval: str = "1d", with_debug: bool = False):
    """
    Compute 5-day Sharpe vs ^GSPC for many tickers in one shot.
    Returns dict {ticker: value or None} and optionally debug info.
    Uses Adj Close explicitly (auto_adjust=False).
    """
    out = {}
    debug = {}

    # --- Benchmark once ---
    bench_df = yf.download(BENCH, period=period, interval=interval,
                           auto_adjust=False, group_by="column",
                           threads=False, progress=False)
    if bench_df.empty:
        raise ValueError("No benchmark data (^GSPC).")

    if isinstance(bench_df.columns, pd.MultiIndex):
        if "Adj Close" in bench_df.columns.get_level_values(0):
            bench_px = bench_df["Adj Close"]
            if isinstance(bench_px, pd.DataFrame):
                # Single column DF -> Series
                bench = bench_px.iloc[:, 0].dropna()
            else:
                bench = bench_px.dropna()
        elif "Close" in bench_df.columns.get_level_values(0):
            bench = bench_df["Close"].dropna()
        else:
            raise ValueError("Benchmark has no Adj Close / Close columns.")
    else:
        # Flat columns (single ticker)
        if "Adj Close" in bench_df.columns:
            bench = bench_df["Adj Close"].dropna()
        elif "Close" in bench_df.columns:
            bench = bench_df["Close"].dropna()
        else:
            raise ValueError("Benchmark has no Adj Close / Close columns (flat).")

    bench_ret = bench.pct_change().dropna()

    # --- Batch download tickers ---
    px = yf.download(tickers=tickers, period=period, interval=interval,
                     auto_adjust=False, group_by="column",
                     threads=False, progress=False)
    if px.empty:
        return {t: None for t in tickers}

    # Expect MultiIndex with first level = field (Adj Close, Close, ...)
    if isinstance(px.columns, pd.MultiIndex):
        fields = px.columns.get_level_values(0)
        if "Adj Close" in fields:
            prices = px["Adj Close"]
        elif "Close" in fields:
            prices = px["Close"]
        else:
            # Pick last numeric block as fallback
            # (rare, but prevents total failure)
            blocks = [lvl for lvl in fields.unique() if lvl not in ("Open","High","Low","Volume","Dividends","Stock Splits")]
            if blocks:
                prices = px[blocks[-1]]
            else:
                return {t: None for t in tickers}
    else:
        # Flat columns: single-ticker case
        if "Adj Close" in px.columns:
            prices = px[["Adj Close"]]
            prices.columns = [tickers[0]]
        elif "Close" in px.columns:
            prices = px[["Close"]]
            prices.columns = [tickers[0]]
        else:
            return {t: None for t in tickers}

    # Ensure columns exactly match tickers we asked for (some may be missing)
    cols = [c for c in prices.columns if c in tickers]
    if not cols:
        return {t: None for t in tickers}
    prices = prices[cols]

    # --- Compute per ticker ---
    for t in tickers:
        try:
            if t not in prices.columns:
                out[t] = None
                if with_debug: debug[t] = "no column after download"
                continue

            s = prices[t].dropna()
            if s.empty:
                out[t] = None
                if with_debug: debug[t] = "no prices"
                continue

            ret = s.pct_change().dropna()
            if ret.empty:
                out[t] = None
                if with_debug: debug[t] = "no returns"
                continue

            # Align with benchmark returns
            idx = ret.index.intersection(bench_ret.index)
            if len(idx) < 5:
                out[t] = None
                if with_debug: debug[t] = f"overlap<5 (have {len(idx)})"
                continue

            ex = (ret.loc[idx] - bench_ret.loc[idx]).dropna()
            if len(ex) < 5:
                out[t] = None
                if with_debug: debug[t] = f"excess<5 (have {len(ex)})"
                continue

            w = ex.tail(5)
            mu, sigma = w.mean(), w.std(ddof=0)
            if sigma == 0 or np.isnan(sigma):
                out[t] = None
                if with_debug: debug[t] = f"sigma={sigma}"
                continue

            out[t] = round((mu / sigma) * math.sqrt(252), 2)

        except Exception as e:
            out[t] = None
            if with_debug: debug[t] = f"exception: {e}"

    return (out, debug) if with_debug else out
