import yfinance as yf
import pandas as pd
import numpy as np

# Calculates standard deviation (volatility) of stock's daily returns
def get_sd(ticker: str, period="1mo", interval="1d"):
    try:
        stock_df = yf.download(ticker, period=period, interval=interval)

        print(f"\n📊 Stock data for {ticker}:\n{stock_df.tail()}\n")
        print(f"📈 Columns in stock_df: {stock_df.columns.tolist()}\n")

        if stock_df.empty:
            raise ValueError("No data received from Yahoo Finance. Check ticker symbol.")

        # Try to get Adj Close, fallback to last column
        stock = stock_df.get("Adj Close", stock_df.iloc[:, -1])

        # Calculate daily returns
        returns = stock.pct_change().dropna()

        if returns.empty:
            raise ValueError("Not enough return data to calculate standard deviation.")

        std_dev = np.std(returns)

        # Optional: scale for annualized volatility
        # daily → annual ≈ std_dev * sqrt(252)
        return round(std_dev, 4)

    except Exception as e:
        raise ValueError(f"Error computing standard deviation: {e}")
