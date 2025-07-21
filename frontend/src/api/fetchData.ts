export async function fetchPrice(ticker: string) {
    const res = await fetch(`http://localhost:8000/api/price?ticker=${ticker}`);
    const json = await res.json();
  
    if (json.error) throw new Error(json.error);
    return json; // e.g., { ticker: "AAPL", price: 210.02 }
  }

  export async function fetchMA(ticker: string) {
    const res = await fetch(`http://localhost:8000/api/ma?ticker=${ticker}`);
    const json = await res.json();
  
    if (json.error) throw new Error(json.error);
    return json;
  }
  
  export async function fetchBeta(ticker: string) {
    const res = await fetch(`http://localhost:8000/api/beta?ticker=${ticker}`);
    const json = await res.json();
  
    if (json.error) throw new Error(json.error);
    return json;
  }