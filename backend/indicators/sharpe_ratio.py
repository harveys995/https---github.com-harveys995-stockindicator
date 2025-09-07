import yfinance as yf
import pandas as pd
import numpy as np

#* Sharp Ratio Calculation ──────────────────────────────────────────────
#? Sharpe Ratio = (mean_daily_return - daily_risk_free_rate) / std_daily_return
#? Where:
#?   mean_daily_return   = average of daily % returns over the window
#?   daily_risk_free_rate = annual_risk_free_rate / 252
#?   std_daily_return     = sample standard deviation of daily % returns (ddof=1)
#* ──────────────────────────────────────────────────────────────────────

def sharpe_ratio(
    tickers,
    period: str = "100d",
    interval: str = "1d",
    risk_free_rate: float = 0.035,   # 3.5% annual
    with_debug: bool = False
):


    out, debug = {}, {}
    rf_daily = risk_free_rate / 252.0

    px = yf.download(
        tickers=tickers,
        period=period,
        interval=interval,
        auto_adjust=False,
        group_by="column",
        threads=False,
        progress=False
    )

    print(px)

    if px.empty:
        return {t: None for t in tickers}

    # --- force Close prices only ---
    if isinstance(px.columns, pd.MultiIndex):
        if "Close" not in px.columns.get_level_values(0):
            return {t: None for t in tickers}
        prices = px["Close"]
    else:
        if "Close" not in px.columns:
            return {t: None for t in tickers}
        prices = px[["Close"]]
        prices.columns = tickers

    for t in tickers:
        try:
            s = prices[t].dropna()
            ret = s.pct_change().dropna()
            if ret.empty:
                out[t] = None
                continue

            mu = ret.mean()
            sigma = ret.std(ddof=1)  # sample stdev like STDEV.S

            if sigma == 0 or np.isnan(sigma):
                out[t] = None
                continue

            sharpe = (mu - rf_daily) / sigma
            out[t] = round(sharpe, 3)

            if with_debug:
                debug[t] = {
                    "n_returns": int(len(ret)),
                    "avg_daily_return": float(mu),
                    "daily_stdev": float(sigma),
                    "rf_daily": float(rf_daily),
                    "sharpe_daily": float(sharpe)
                }
        except Exception as e:
            out[t] = None
            if with_debug:
                debug[t] = f"exception: {e}"

    return (out, debug) if with_debug else out
