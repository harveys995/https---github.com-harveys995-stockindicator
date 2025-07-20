import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

const Price = () => {
  const price = useSelector((state: RootState) => state.price.value);
  const status = useSelector((state: RootState) => state.price.status);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error loading price.</p>;
  if (!price) return <p>No data yet.</p>; // ✅ handle null state safely

  return (
    <div className='w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6'>
      <h2 className='font-sans'>Market Price</h2>
      <p>${price.price.toFixed(2)}</p>
    </div>
  );
};

export default Price;
