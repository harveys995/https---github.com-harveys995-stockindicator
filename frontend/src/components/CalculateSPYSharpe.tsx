import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../Store/Store/store';
import { loadSP500Sharpe, selectSP500SharpeData, selectSP500SharpeStatus } from '../Store/Slices/SP500Sharpe_Slice';
import { selectSelectedETF } from '../Store/Slices/ETF_Slice';
import { PrimaryButton } from './PrimaryButton';

export function CalculateSPYSharpe() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedETF = useSelector(selectSelectedETF);
  const status = useSelector(selectSP500SharpeStatus);
  const data = useSelector(selectSP500SharpeData);
  const loading = status === 'loading';

  const isSPYSelected = selectedETF?.symbol === 'SPY';

  useEffect(() => {
    if (isSPYSelected && status === 'idle') {
      dispatch(loadSP500Sharpe());
    }
  }, [isSPYSelected, status, dispatch]);

  const handleClick = useCallback(async () => {
    try {
      await dispatch(loadSP500Sharpe()).unwrap();
    } catch (err) {
      console.error('Scan failed:', err);
    }
  }, [dispatch]);

  if (!isSPYSelected) {
    return (
      <div className="w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6">
        <div className="text-center text-gray-600">
          Select S&P 500 to view Sharpe ratios
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg">S&P 500 Top Performers (5-Day Sharpe Ratio)</div>
        <PrimaryButton onClick={handleClick} loading={loading}>
          Refresh
        </PrimaryButton>
      </div>

      {loading && <div className="text-center">Loading Sharpe ratios...</div>}

      {status === 'succeeded' && data?.top_10 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.top_10.map(([ticker, ratio], index) => (
            <div key={ticker} className="bg-white/60 rounded-2xl p-4">
              <div className="text-xs text-gray-500">#{index + 1}</div>
              <div className="font-medium text-lg">{ticker}</div>
              <div className="text-sm text-gray-600">Sharpe Ratio</div>
              <div className="font-bold text-xl text-green-600">{ratio}</div>
            </div>
          ))}
        </div>
      )}

      {status === 'succeeded' && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Calculated {data?.calculated} of {data?.total_stocks} stocks
        </div>
      )}
    </div>
  );
}