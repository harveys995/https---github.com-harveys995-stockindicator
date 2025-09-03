import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../Store/Store/store';
import { loadSp500Rows, selectSp500Status, selectSp500Rows } from '../Store/Slices/SP500List_Slice';
import { PrimaryButton } from './PrimaryButton';

export function ScanSp500Button() {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectSp500Status);
  const rows = useSelector(selectSp500Rows);
  const loading = status === 'loading';

  const handleClick = useCallback(async () => {
    try {
      const data = await dispatch(loadSp500Rows()).unwrap();
      // TODO: run your calculations here (e.g., volatility, Sharpe, etc.)
      console.log('Rows loaded:', data.length);
    } catch (err) {
      console.error('Scan failed:', err);
    }
  }, [dispatch]);

  return (
    <div className="flex items-center gap-3">
      <PrimaryButton onClick={handleClick} loading={loading}>
        Scan S&P 500
      </PrimaryButton>

      {status === 'succeeded' && (
        <span className="text-sm text-gray-500">{rows.length} stocks loaded</span>
      )}
    </div>
  );
}
