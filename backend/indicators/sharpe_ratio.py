import yfinance as yf
import pandas as pd
import numpy as np

#* Sharp Ratio Calculation ──────────────────────────────────────────────
#? Sharpe Ratio = (mean_daily_return - daily_annual_risk_free_rate) / std_daily_return
#? Where:
#?   mean_daily_return   = average of daily % returns over the window
#?   daily_annual_risk_free_rate = annual_annual_risk_free_rate / 252
#?   std_daily_return     = sample standard deviation of daily % returns (ddof=1)
#* ──────────────────────────────────────────────────────────────────────

def sharpe_ratio(
    tickers,
    period: str = "100d",
    interval: str = "1d",
    annual_risk_free_rate: float = 0.035,

):

    out, debug = {}, {}
    daily_annual_risk_free_rate = annual_risk_free_rate / 252.0 

    px = yf.download(
        tickers=tickers,
        period=period,
        interval=interval,
        auto_adjust=True, #? Account for dividend payouts & splits
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

            sharpe = (mu - daily_annual_risk_free_rate) / sigma
            out[t] = round(sharpe, 3)

        except Exception as e:
            out[t] = None


    return out
