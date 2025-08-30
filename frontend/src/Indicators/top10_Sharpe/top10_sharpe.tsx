// Top10SharpeGrid.tsx
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

export default function Top10SharpeGrid() {
  const { value, status, error } = useSelector(
    (s: RootState) => (s as any).sharpeGrid   // ← was s.top10
  ) ?? { value: null, status: 'idle' as const };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed')  return <p>Error: {error || 'Failed to load'}</p>;
  if (!value)               return <p>No data yet.</p>;

  const { universe, sharpe_ratio_5d, benchmark } = value;

  return (
    <div className="w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6">
      <div className="flex items-baseline justify-between">
        <div className="text-lg">Top 10 Sharpe (5-Day)</div>
        <div className="text-sm opacity-70">Benchmark: <span className="font-mono">{benchmark}</span></div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {universe.map((ticker) => {
          const v = sharpe_ratio_5d[ticker as keyof typeof sharpe_ratio_5d] ?? null;
          const isPos = typeof v === 'number' && v > 0;
          return (
            <div key={ticker} className="rounded-2xl border border-black/5 bg-white/60 p-4 shadow-sm">
              <div className="text-sm opacity-70">Ticker</div>
              <div className="font-semibold text-xl">{ticker}</div>

              <div className="mt-2 text-sm opacity-70">Sharpe (5d)</div>
              <div className={`font-semibold text-lg ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                {v === null || Number.isNaN(v) ? 'N/A' : v.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
