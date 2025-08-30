import yfinance as yf
import pandas as pd
import numpy as np

# Calculates Average True Range (ATR) of a stock
def get_atr(ticker: str, period="1mo", interval="1d", window=14):
    try:
        stock_df = yf.download(ticker, period=period, interval=interval)

        print(f"\n📊 Stock data for {ticker}:\n{stock_df.tail()}\n")
        print(f"📈 Columns in stock_df: {stock_df.columns.tolist()}\n")

        if stock_df.empty or len(stock_df) < window + 1:
            raise ValueError("Not enough data to compute ATR. Try a longer period or smaller window.")

        high = stock_df["High"]
        low = stock_df["Low"]
        close = stock_df["Close"]

        prev_close = close.shift(1)

        # Calculate True Range (TR)
        tr_hl = high - low
        tr_hpc = (high - prev_close).abs()
        tr_lpc = (low - prev_close).abs()

        tr = pd.concat([tr_hl, tr_hpc, tr_lpc], axis=1)
        tr.columns = ["H-L", "H-PC", "L-PC"]

        true_range = tr.max(axis=1)

        # Calculate ATR using rolling window
        atr = true_range.rolling(window=window).mean()

        latest_atr = atr.dropna().iloc[-1] if not atr.dropna().empty else None

        if latest_atr is None:
            raise ValueError("Not enough data to compute ATR.")

        return round(latest_atr, 4)

    except Exception as e:
        raise ValueError(f"Error computing ATR: {e}")
