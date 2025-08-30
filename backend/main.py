from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from indicators import get_price
from indicators import get_ma
from indicators import get_sp500_list_df
from openai import OpenAI
from dotenv import load_dotenv
import os


load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/analyze")
async def analyze(ticker: str):
    # Replace with real indicator values
    price = 429.76
    ma50 = 300.73
    ma200 = 253.09
    atr = 19.69
    std_dev = 0.38

    prompt = (
        f"The stock {ticker} is currently trading at ${price}.\n"
        f"- 50-day MA: ${ma50}\n"
        f"- 200-day MA: ${ma200}\n"
        f"- ATR: {atr}\n"
        f"- Std Dev: {std_dev}\n"
        f"Provide a confidence score out of 10 on a short term investment. if this stock will go up or not, if I can achieve 1-3% today, no more than 300 characters please in your response."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You're a helpful financial assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        return {"analysis": response.choices[0].message.content}

    except Exception as e:
        return {"error": str(e)}

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

@app.get("/api/sp500/table")
def sp500_table():
    df = get_sp500_list_df()
    return {"rows": df.to_dict(orient="records")}  # avoid: return df or []