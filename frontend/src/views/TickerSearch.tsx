import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store/store';
import { setTicker } from '../store/ticker';
import { useState } from 'react';

function TickerSearch() {
  const dispatch = useDispatch();
  const ticker = useSelector((state: RootState) => state.ticker.value);
  const [input, setInput] = useState(ticker); // ← local input state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = input.trim().toUpperCase();
    if (clean) {
      dispatch(setTicker(clean)); // ✅ Only dispatch here
      console.log("Fetching price for:", clean);
    }
  };

  return (
    <div className="w-full bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6">
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)} // ← only update local state
          className="flex-1 p-3 rounded-xl text-lg bg-white/70 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Enter ticker (e.g. AAPL)"
        />
        <button
          type="submit"
          className="p-2 bg-orange-400 hover:bg-orange-500 text-black rounded-xl text-3xl transition"
        >
          ↑
        </button>
      </form>
    </div>
  );
}

export default TickerSearch;
