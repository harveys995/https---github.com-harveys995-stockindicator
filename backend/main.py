from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from indicators import get_price
from indicators import get_ma
from indicators import get_beta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/price")
def price_data(ticker: str):
    try:
        data = get_price(ticker)
        if not data:
            return {"error": f"No pricing data for {ticker}"}
        return data
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/ma")
def ma_data(ticker: str):
    try:
        data = get_ma(ticker)
        if not data:
            return {"error": f"No moving average data for {ticker}"}
        return data
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/beta")
def beta_data(ticker: str):
    try:
        data = get_beta(ticker, market_ticker="^GSPC", period="6mo", interval="1d")
        return {
            "ticker": ticker.upper(),
            "beta": data
        }
    except Exception as e:
        return {"error": str(e)}
