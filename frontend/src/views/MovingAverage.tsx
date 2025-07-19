import { useState } from 'react';

interface MovingAverageData {
  ticker: string;
  price: number;
  "50ma": number;
  "200ma": number;
  above_200ma: boolean;
}

function MovingAverage() {
  const [ticker, setTicker] = useState('COIN');
  const [data, setData] = useState<MovingAverageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPrice = (symbol: string) => {
    setLoading(true);
    setError('');
    fetch(`http://localhost:8000/api/movingaverage?ticker=${symbol}`)
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200">
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
          Get Data
        </button>
      </form>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div>
          <h2 className="text-lg font-semibold text-blue-600 mb-2">{data.ticker} Market Info</h2>
          <p className="text-gray-700 text-md mb-1">💵 Price: ${data.price.toFixed(2)}</p>
          <p className="text-gray-700 text-md mb-1">📉 50 MA: ${data["50ma"].toFixed(2)}</p>
          <p className="text-gray-700 text-md mb-1">📈 200 MA: ${data["200ma"].toFixed(2)}</p>
          <p className="text-md font-medium text-green-600">
            {data.above_200ma ? '✅ Price is above the 200 MA' : '⚠️ Price is below the 200 MA'}
          </p>
        </div>
      )}
    </div>
  );
}

export default MovingAverage;
