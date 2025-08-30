import { useSelector } from 'react-redux';
import { type RootState } from '../../store/store';

const ATR = () => {
  const atr = useSelector((state: RootState) => state.atr.value);
  const status = useSelector((state: RootState) => state.price.status);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error loading price.</p>;
  if (!atr) return <p>No data yet.</p>; // ✅ handle null state safely

  return (
    <div className='w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6'>
      <div className='text-xl'>ATR</div>
      <div className='font-medium text-3xl'>{atr.atr.toFixed(2)}</div>
    </div>
  );
};

export default ATR;
