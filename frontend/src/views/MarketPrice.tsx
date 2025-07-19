import {useState } from 'react';

interface PriceData {
  ticker: string;
  price: number;
}

function MarketPrice() {
  const [ticker, setTicker] = useState('$$$$');
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const fetchPrice = (symbol: string) => {
    setLoading(true);
    setError('');
    fetch(`http://localhost:8000/api/price?ticker=${symbol}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setData(null);
          setError(json.error);
        } else {
          setData(json);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('API fetch error:', err);
        setError('Failed to fetch price');
        setLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim() !== '') {
      fetchPrice(ticker.trim().toUpperCase());
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter ticker (e.g. AAPL)"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Get Price
        </button>
      </form>

      {loading && <p className="text-gray-500">Loading...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div>
          <h2 className="text-lg font-semibold text-blue-600 mb-1">Market Price</h2>
          <p className="text-xl">{data.ticker}: ${data.price.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}


export default MarketPrice;