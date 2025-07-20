import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def get_beta(ticker: str, market_ticker: str, period: str, interval: str):
    stock_df = yf.download(ticker, period=period, interval=interval)
    market_df = yf.download(market_ticker, period=period, interval=interval)

    if stock_df.empty or market_df.empty:
        raise ValueError("No data received from Yahoo Finance. Check ticker symbols or internet connection.")

    # Handle multi-level columns by using .columns if needed
    stock_col = "Adj Close" if "Adj Close" in stock_df.columns else stock_df.columns[-1]
    market_col = "Adj Close" if "Adj Close" in market_df.columns else market_df.columns[-1]

    try:
        stock = stock_df[stock_col]
        market = market_df[market_col]
    except KeyError:
        raise ValueError(f"Missing expected column '{stock_col}' or '{market_col}' in the data.")

    df = pd.DataFrame({'stock': stock, 'market': market}).dropna()
    df['stock_return'] = df['stock'].pct_change()
    df['market_return'] = df['market'].pct_change()
    df = df.dropna()

    if df.empty:
        raise ValueError("Not enough data to compute beta.")

    X = df['market_return'].values.reshape(-1, 1)
    y = df['stock_return'].values

    reg = LinearRegression().fit(X, y)
    beta = reg.coef_[0]
    return round(beta, 2)
