import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../Store/Store/store';
import { loadSP500Sharpe, selectSP500SharpeData, selectSP500SharpeStatus } from '../Store/Slices/SP500Sharpe_Slice';
import { selectSelectedETF } from '../Store/Slices/ETF_Slice';
import { PrimaryButton } from './PrimaryButton';

const periods = [
  { key: '5d', label: '5 Day' },
  { key: '30d', label: '30 Day' },
  { key: '100d', label: '100 Day' },
  { key: '252d', label: '252 Day' }
] as const;

export function CalculateSPYSharpe() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedETF = useSelector(selectSelectedETF);
  const status = useSelector(selectSP500SharpeStatus);
  const data = useSelector(selectSP500SharpeData);
  const loading = status === 'loading';
  const isSPYSelected = selectedETF?.symbol === 'SPY';

  // Calculate most frequent stocks across all periods with weighted scoring
  const getMostFrequentStocks = () => {
    if (!data?.periods) return [];
    
    const tickerScores: Record<string, { count: number, score: number }> = {};
    
    periods.forEach(({ key }) => {
      data.periods[key]?.forEach(([ticker], index) => {
        if (!tickerScores[ticker]) {
          tickerScores[ticker] = { count: 0, score: 0 };
        }
        tickerScores[ticker].count += 1;
        // Higher score for better positions (position 0 = 6 points, position 4 = 2 points)
        tickerScores[ticker].score += (6 - index);
      });
    });
    
    return Object.entries(tickerScores)
      .sort(([,a], [,b]) => {
        // First sort by count, then by score if counts are equal
        if (a.count !== b.count) return b.count - a.count;
        return b.score - a.score;
      })
      .slice(0, 5)
      .map(([ticker, { count, score }]) => ({ ticker, count, score }));
  };

  const frequentStocks = getMostFrequentStocks();

  useEffect(() => {
    if (isSPYSelected && status === 'idle') {
      dispatch(loadSP500Sharpe());
    }
  }, [isSPYSelected, status, dispatch]);

  const handleRefresh = useCallback(async () => {
    try {
      await dispatch(loadSP500Sharpe()).unwrap();
    } catch (err) {
      console.error('Scan failed:', err);
    }
  }, [dispatch]);

  if (!isSPYSelected) {
    return (
      <div className="w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-8">
        <div className="text-center text-gray-600 text-lg">
          Select S&P 500 to view Sharpe ratios
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-gray-800">Top 5 Sharpe Ratios & Most Frequent</h2>
        {/* <PrimaryButton onClick={handleRefresh} loading={loading}>
          Refresh
        </PrimaryButton> */}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="text-gray-600">Loading Sharpe ratios...</div>
        </div>
      )}

      {status === 'succeeded' && data?.periods && (
        <div className="flex gap-4">
          <div className="flex-1 grid grid-cols-2 xl:grid-cols-4 gap-2">
            {periods.map(({ key, label }) => (
              <div key={key} className="bg-white/60 rounded-xl p-2">
                <h3 className="text-xs font-medium text-gray-700 mb-1 text-center">{label}</h3>
                <div className="space-y-0.5">
                  {data.periods[key].map(([ticker, ratio], index) => (
                    <div key={ticker} className="bg-white/80 rounded-md p-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 w-3">
                          #{index + 1}
                        </span>
                        <span className="font-medium text-gray-800 text-xs">{ticker}</span>
                      </div>
                      <span className="font-bold text-green-600 text-xs">{ratio}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-32 bg-white/60 rounded-xl p-2">
            <h3 className="text-xs font-medium text-gray-700 mb-1 text-center">Most Frequent</h3>
            <div className="space-y-0.5">
              {frequentStocks.map(({ ticker }, index) => (
                <div key={ticker} className="bg-white/80 rounded-md p-1.5 flex items-center justify-center">
                  <span className="font-medium text-gray-800 text-xs">{ticker}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
