export async function fetchPrice(ticker: string) {
    const res = await fetch(`http://localhost:8000/api/price?ticker=${ticker}`);
    const json = await res.json();
  
    if (json.error) throw new Error(json.error);
    return json; // e.g., { ticker: "AAPL", price: 210.02 }
  }
  