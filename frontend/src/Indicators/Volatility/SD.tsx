import { useSelector } from 'react-redux';
import { type RootState } from '../../store/store';

const SD = () => {
  const sd = useSelector((state: RootState) => state.sd.value);
  const status = useSelector((state: RootState) => state.price.status);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error loading price.</p>;
  if (!sd) return <p>No data yet.</p>; // ✅ handle null state safely

  return (
    <div className='w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6'>
      <div className='text-xl'>Standard Deviation</div>
      <div className='font-medium text-3xl'>{sd.sd.toFixed(2)}</div>
    </div>
  );
};

export default SD;
