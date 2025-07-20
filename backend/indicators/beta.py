import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

#! Calculating Beta on 1 month period and 1 day Interval
# TODO: To incorporate flexibility when calculating Beta, perhaps with user defined period and interval

def get_beta(ticker: str, market_ticker: str, period="1mo", interval="1d"): 
    try:
        stock_df = yf.download(ticker, period=period, interval=interval)
        market_df = yf.download(market_ticker, period=period, interval=interval)

        print(f"\n📊 Stock data for {ticker}:\n{stock_df.tail()}\n")
        print(f"📈 Columns in stock_df: {stock_df.columns.tolist()}\n")

        if stock_df.empty or market_df.empty:
            raise ValueError("No data received from Yahoo Finance. Check ticker symbols.")

        stock = stock_df.get("Adj Close", stock_df.iloc[:, -1])
        market = market_df.get("Adj Close", market_df.iloc[:, -1])

        df = pd.DataFrame({'stock': stock, 'market': market}).dropna()
        df['stock_return'] = df['stock'].pct_change()
        df['market_return'] = df['market'].pct_change()
        df = df.dropna()

        if df.empty:
            raise ValueError("Not enough data to compute beta.")

        X = df['market_return'].values.reshape(-1, 1)
        y = df['stock_return'].values

        reg = LinearRegression().fit(X, y)
        return round(reg.coef_[0], 2)

    except Exception as e:
        raise ValueError(f"Error computing beta: {e}")
