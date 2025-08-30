import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch } from '../store/store';
import { loadPrice } from '../store/price';
import { loadMA } from '../store/ma';
import { loadSp500Rows } from '../store/sp500List';
import { loadAIAnalysis } from '../store/aianalysis';


const DataObserver = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ticker = useSelector((state: RootState) => state.ticker.value);

  useEffect(() => {
    if (ticker !== '$$$$') {
      dispatch(loadPrice(ticker));
      dispatch(loadMA(ticker));
      dispatch(loadAIAnalysis(ticker));
      dispatch(loadSp500Rows());
    }
  }, [ticker, dispatch]);

  return null; // No UI — just runs logic
};

export default DataObserver;
