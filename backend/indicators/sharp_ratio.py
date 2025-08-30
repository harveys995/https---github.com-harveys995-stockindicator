import yfinance as yf
import pandas as pd
import numpy as np

#! Sharpe Ratio (vs S&P 500 benchmark) over 5, 30, 100, 200 days
# - Uses ^GSPC as benchmark instead of risk-free rate
# - Annualizes with sqrt(252) for daily data
# TODO: Add flexibility for custom benchmarks

def get_sharpe_ratio(
    ticker: str,
    period: str = "1y",
    interval: str = "1d",
    windows = (5, 30, 100, 200)
):
    try:
        # --- Fetch asset + benchmark ---
        asset_df = yf.download(ticker, period=period, interval=interval, auto_adjust=True)
        sp500_df = yf.download("^GSPC", period=period, interval=interval, auto_adjust=True)

        if asset_df.empty or sp500_df.empty:
            raise ValueError("No data received from Yahoo Finance. Check ticker symbols.")

        asset = asset_df.get("Adj Close", asset_df.iloc[:, -1]).dropna()
        sp500 = sp500_df.get("Adj Close", sp500_df.iloc[:, -1]).dropna()

        df = pd.DataFrame({"asset": asset, "sp500": sp500}).dropna()
        df["asset_ret"] = df["asset"].pct_change()
        df["sp500_ret"] = df["sp500"].pct_change()
        df = df.dropna()

        if df.empty:
            raise ValueError("Not enough data to compute Sharpe vs S&P 500.")

        # Excess returns relative to S&P 500
        excess = df["asset_ret"] - df["sp500_ret"]

        # Annualization factor
        if interval.endswith("d"):
            ann_factor = 252
        elif interval.endswith("wk"):
            ann_factor = 52
        elif interval.endswith("mo"):
            ann_factor = 12
        else:
            ann_factor = 252

        # Compute Sharpe for each window
        sharpe = {}
        for w in windows:
            if len(excess) < w:
                sharpe[w] = np.nan
                continue

            window_excess = excess.tail(w)
            mu = window_excess.mean()
            sigma = window_excess.std(ddof=0)

            if sigma == 0 or np.isnan(sigma):
                sharpe[w] = np.nan
            else:
                sharpe[w] = round((mu / sigma) * np.sqrt(ann_factor), 2)

        return sharpe

    except Exception as e:
        raise ValueError(f"Error computing Sharpe vs S&P 500: {e}")
