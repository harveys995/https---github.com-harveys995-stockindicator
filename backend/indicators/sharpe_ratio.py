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
    period: str = "252d",
    interval: str = "1d",
    annual_risk_free_rate: float = 0.035,
):

    output = {}
    daily_annual_risk_free_rate = annual_risk_free_rate / 252.0 

    price_data = yf.download(
        tickers=tickers,
        period=period,
        interval=interval,
        auto_adjust= True, #! Account for dividend payout & splits
    )

    print(f"Date range: {price_data.index.min()} to {price_data.index.max()}")
    print(f"Period requested: {period}")

    # price_data.to_csv("prices.csv")

    if price_data.empty:
        return {t: None for t in tickers} # If YF doesn't work we return a list of tickers with values = None 
    
    if isinstance(price_data.columns, pd.MultiIndex): # Checking if columns are multiIndex ("Close", "Open", "Volume" etc)
        if "Close" not in price_data.columns.get_level_values(0):
            return {t: None for t in tickers} # If theres no "Close" column we return a list of tickers with values = None 
        prices = price_data["Close"] # Only picking the "Close" prices
        # prices.to_csv("close_prices.csv")

    else:
        if "Close" not in price_data.columns: 
            return {t: None for t in tickers} # If theres no "Close" column we return a list of tickers with values = None 
        prices = price_data[["Close"]]
        prices.columns = tickers

    for t in tickers:
        try:
            s = prices[t].dropna()
            ret = s.pct_change().dropna()
            # print(ret)
            if ret.empty:
                output[t] = None
                continue

            mu = ret.mean()
            sigma = ret.std(ddof=0)  # sample stdev like STDEV
            
            # print(t, mu, sigma)

            if sigma == 0 or np.isnan(sigma):
                output[t] = None
                continue

            sharpe = (mu - daily_annual_risk_free_rate) / sigma
            output[t] = round(sharpe, 3)

        except Exception as e:
            output[t] = None
    
    return output
