import yfinance as yf

def get_price(ticker: str):
    try:
        ticker_obj = yf.Ticker(ticker)
        price = ticker_obj.fast_info["lastPrice"]

        return {
            "ticker": ticker.upper(),
            "price": round(price, 2)
        }
    except Exception as e:
        print(f"[get_price error] {e}")
        return None
