import { useSelector } from 'react-redux';
import { type RootState } from '../../store/store';

const Beta = () => {
  const beta = useSelector((state: RootState) => state.beta.value);
  const status = useSelector((state: RootState) => state.price.status);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error loading price.</p>;
  if (!beta) return <p>No data yet.</p>; // ✅ handle null state safely

  return (
    <div className='w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6'>
      <div className='text-xl'>Beta</div>
      <div className='font-medium text-3xl'>{beta.beta.toFixed(2)}</div>
    </div>
  );
};

export default Beta;
