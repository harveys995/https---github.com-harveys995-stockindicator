import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../store/store';
import { loadSp500Rows } from '../store/sp500List';
import { loadSP500Prices } from '../store/sp500Prices';

const SP500List = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sp500Data = useSelector((state: RootState) => state.sp500.value);
  const sp500Status = useSelector((state: RootState) => state.sp500.status);
  const prices = useSelector((state: RootState) => state.sp500Prices.prices);
  const pricesStatus = useSelector((state: RootState) => state.sp500Prices.status);

  useEffect(() => {
    if (sp500Status === 'idle') {
      dispatch(loadSp500Rows());
    }
  }, [sp500Status, dispatch]);

  useEffect(() => {
    if (sp500Data && sp500Status === 'succeeded' && pricesStatus === 'idle') {
      const symbols = sp500Data.map((row: any) => row.Symbol).filter(Boolean);
      dispatch(loadSP500Prices(symbols));
    }
  }, [sp500Data, sp500Status, pricesStatus, dispatch]);

  if (sp500Status === 'loading') return <p>Loading SP500 list...</p>;
  if (sp500Status === 'failed') return <p>Error loading SP500 data.</p>;
  if (pricesStatus === 'loading') return <p>Loading prices...</p>;
  if (!sp500Data) return <p>No SP500 data available.</p>;

  return (
    <div className='w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6'>
      <div className='text-lg mb-4'>S&P 500 Stocks</div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto'>
        {sp500Data.map((row: any, index: number) => {
          const symbol = row.Symbol;
          const company = row.Security;
          const price = prices[symbol];
          
          return (
            <div key={index} className='bg-white/60 rounded-xl p-3'>
              <div className='font-medium text-sm'>{symbol}</div>
              <div className='text-xs text-gray-600 truncate'>{company}</div>
              <div className='font-medium text-lg'>
                {price ? (
                  <>
                    <span className="text-sm align-bottom">$</span>
                    {price.price.toFixed(2)}
                  </>
                ) : (
                  <span className="text-gray-400">Loading...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SP500List;