import { useSelector } from 'react-redux';
import { type RootState } from '../../store/store';

const AIAnalysis = () => {
  const aianalysis = useSelector((state: RootState) => state.aianalysis.value);
  const status = useSelector((state: RootState) => state.ma.status);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error loading price.</p>;
  if (!aianalysis) return <p>No data yet.</p>; // ✅ handle null state safely

  return (
    <div className=' w-full bg-blue-300/40 backdrop-blur-md rounded-3xl shadow-md p-6'>
        <div className='font-medium text-3xl'>
            {aianalysis.analysis}
        </div>
     </div>

  );
};

export default AIAnalysis;
