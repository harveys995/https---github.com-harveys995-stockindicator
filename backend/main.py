from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from indicators import get_price

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/price")
def price(ticker: str):
    data = get_price(ticker)
    if not data:
        return {"error": f"No pricing data for {ticker}"}
    return data
