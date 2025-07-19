from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

app = FastAPI()

# Allow access from React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
import yfinance as yf

# aapl = yf.Ticker("AAPL")
# print(aapl.quarterly_earnings)
# print(aapl.earnings)
# print(aapl.calendar)


@app.get("/api/info")
def get_info():
    try:
        aapl = yf.Ticker("AAPL")
        calendar = aapl.calendar

        if not calendar or "Earnings Date" not in calendar:
            return {"error": "No earnings date available"}

        result = {
            "earnings_date": str(calendar["Earnings Date"][0]),
            "eps_high": calendar.get("Earnings High"),
            "eps_low": calendar.get("Earnings Low"),
            "eps_avg": calendar.get("Earnings Average"),
            "revenue_high": calendar.get("Revenue High"),
            "revenue_low": calendar.get("Revenue Low"),
            "revenue_avg": calendar.get("Revenue Average"),
        }
        return result

    except Exception as e:
        return {"error": str(e)}

