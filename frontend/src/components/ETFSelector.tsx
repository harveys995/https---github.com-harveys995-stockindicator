import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../Store/Store/store';
import { setSelectedETF, selectSelectedETF, selectAvailableETFs } from '../Store/Slices/ETF_Slice';

const ETFSelector = () => {
  const dispatch = useDispatch();
  const selectedETF = useSelector(selectSelectedETF);
  const etfOptions = useSelector(selectAvailableETFs);

  return (
    <div className="w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6">
      <div className="text-lg mb-4">Select Market Index</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {etfOptions.map((etf) => (
          <button
            key={etf.symbol}
            onClick={() => dispatch(setSelectedETF(etf.name))}
            className={`p-4 rounded-2xl transition-all ${
              selectedETF?.name === etf.name
                ? 'bg-orange-400 text-black shadow-lg'
                : 'bg-white/60 hover:bg-white/80 text-gray-800'
            }`}
          >
            <div className="font-medium text-lg">{etf.name}</div>
            <div className="text-sm opacity-75">{etf.symbol}</div>
            <div className="text-xs mt-1">{etf.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ETFSelector;