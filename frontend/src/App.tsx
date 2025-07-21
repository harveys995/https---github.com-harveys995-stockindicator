import { useEffect, useState } from 'react';
import QuadrantView from './views/GridView';
import './BreathingBackground/BreathingBackground.css'
import BreathingBackground from './BreathingBackground/BreathingBackground';
import DataObserver from './components/DataObserver';

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
    <div className="flex flex-col justify-center p-6">
      <BreathingBackground/>
      <DataObserver /> {/*Watches store and triggers fetch */}
      <QuadrantView></QuadrantView>
    </div>
  );
  
}

export default App;
