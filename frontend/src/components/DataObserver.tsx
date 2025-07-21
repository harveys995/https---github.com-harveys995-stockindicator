import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch } from '../store/store';
import { loadPrice } from '../store/price';
import { loadMA } from '../store/ma';
import { loadBeta } from '../store/beta';

const DataObserver = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ticker = useSelector((state: RootState) => state.ticker.value);

  useEffect(() => {
    if (ticker !== '$$$$') {
      dispatch(loadPrice(ticker));
      dispatch(loadMA(ticker));
      dispatch(loadBeta(ticker));
    }
  }, [ticker, dispatch]);

  return null; // No UI — just runs logic
};

export default DataObserver;
