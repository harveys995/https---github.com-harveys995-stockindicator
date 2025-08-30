import { useSelector } from 'react-redux';
import { type RootState } from '../../store/store';

const MA = () => {
  const ma = useSelector((state: RootState) => state.ma.value);
  const status = useSelector((state: RootState) => state.ma.status);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error loading price.</p>;
  if (!ma) return <p>No data yet.</p>; // ✅ handle null state safely

  return (
    <div className='grid grid-cols-2 w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6'>
      <div className='col-span-1 text-lg'>50ma
      <div className='font-medium text-3xl'>
        <span className="text-xl align-bottom">$</span>{ma.ma50.toFixed(2)}
      </div>
      </div>
      <div className='col-span-1 text-lg'>200ma
      <div className='font-medium text-3xl'>
        <span className="text-xl align-bottom">$</span>{ma.ma200.toFixed(2)}
      </div>
      </div>
    </div>
  );
};

export default MA;
