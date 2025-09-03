import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch } from '../Store/Store/store';
import { loadPrice } from '../Store/price';
import { loadMA } from '../Store/ma';
import { loadSp500Rows } from '../Store/Slices/SP500List_Slice';
import { loadAIAnalysis } from '../Store/aianalysis';


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
