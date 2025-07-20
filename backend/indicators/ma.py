import yfinance as yf
import pandas as pd

def get_ma(ticker: str):
    try:
        ticker_obj = yf.Ticker(ticker)
        df = ticker_obj.history(period="1y")

        df["50ma"] = df["Close"].rolling(window=50).mean()
        df["200ma"] = df["Close"].rolling(window=200).mean()
        latest = df.iloc[-1]

        return {
            "ticker": ticker.upper(),
            "price": float(round(latest["Close"], 2)),
            "50ma": float(round(latest["50ma"], 2)) if pd.notna(latest["50ma"]) else None,
            "200ma": float(round(latest["200ma"], 2)) if pd.notna(latest["200ma"]) else None,
            "above_200ma": bool(latest["Close"] > latest["200ma"]) if pd.notna(latest["200ma"]) else None
        }

    except Exception as e:
        print(f"[get_moving_averages error] {e}")
        return None
