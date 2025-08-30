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

export async function fetchSD(ticker: string) {
  const res = await fetch(`http://localhost:8000/api/sd?ticker=${ticker}`);
  const json = await res.json();

  if (json.error) throw new Error(json.error);
  return json;
}

export async function fetchATR(ticker: string) {
  const res = await fetch(`http://localhost:8000/api/atr?ticker=${ticker}`);
  const json = await res.json();

  if (json.error) throw new Error(json.error);
  return json;
}

export async function fetchAIAnalysis(ticker: string) {
  const res = await fetch(`http://localhost:8000/api/analyze?ticker=${ticker}`);
  const json = await res.json();

  if (json.error) throw new Error(json.error);
  return json;
}

export async function fetchtop10sharpe5d() {
  const res = await fetch(`http://localhost:8000/api/top10_sharpe_5d`);
  const json = await res.json();

  if (json.error) throw new Error(json.error);
  return json;
}