import { useEffect, useState } from 'react';
import QuadrantView from './views/QuadrantView';
import Navbar from './Navbar';

interface StockData {
  earnings_date: string;
  eps_high: number;
  eps_low: number;
  eps_avg: number;
  revenue_high: number;
  revenue_low: number;
  revenue_avg: number;
}


function App() {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/info')
      .then((res) => res.json())
      .then((json) => {
        console.log('Fetched data:', json);
        setData({
          earnings_date: json.earnings_date,
          eps_high: json.eps_high,
          eps_low: json.eps_low,
          eps_avg: json.eps_avg,
          revenue_high: json.revenue_high,
          revenue_low: json.revenue_low,
          revenue_avg: json.revenue_avg,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('API fetch error:', err);
        setLoading(false);
      });
  }, []);
  

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (!data) return <p className="text-center mt-10 text-red-500">No data available</p>;

  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar></Navbar>
      <QuadrantView></QuadrantView>
      {/* <div className="bg-gray-400 p-6 rounded-xl shadow-md w-full text-white">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">AAPL Earnings Forecast</h1>
        <p className="text-lg"><span className="font-semibold">Earnings Date:</span> {data.earnings_date}</p>
        <p className="text-lg"><span className="font-semibold">EPS Avg:</span> ${data.eps_avg?.toFixed(2)}</p>
        <p className="text-lg"><span className="font-semibold">EPS High:</span> ${data.eps_high?.toFixed(2)}</p>
        <p className="text-lg"><span className="font-semibold">EPS Low:</span> ${data.eps_low?.toFixed(2)}</p>
        <p className="text-lg"><span className="font-semibold">Revenue Avg:</span> ${data.revenue_avg.toLocaleString()}</p>
        <p className="text-lg"><span className="font-semibold">Revenue High:</span> ${data.revenue_high.toLocaleString()}</p>
        <p className="text-lg"><span className="font-semibold">Revenue Low:</span> ${data.revenue_low.toLocaleString()}</p>
      </div> */}
    </div>
  );
  
}

export default App;
