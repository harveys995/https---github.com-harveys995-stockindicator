import MarketPrice from "./MarketPrice";

function QuadrantView() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <h1 className="text-black">APPL</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          
          {/* Quadrant 1: Price Data */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <MarketPrice></MarketPrice>
          </div>
  
          {/* Quadrant 2: Earnings Forecast */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-green-600 mb-2">💰 Earnings Forecast</h2>
            <p className="text-gray-700">Earnings Date: <span className="font-semibold">2025-07-31</span></p>
            <p className="text-gray-700">EPS Avg: <span className="font-semibold">$1.42</span></p>
            <p className="text-gray-500 text-sm">High: $1.51 | Low: $1.34</p>
          </div>
  
          {/* Quadrant 3: Revenue Forecast */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-yellow-600 mb-2">📊 Revenue Forecast</h2>
            <p className="text-gray-700">Avg: <span className="font-semibold">$88.64B</span></p>
            <p className="text-gray-500 text-sm">High: $90.10B | Low: $86.91B</p>
          </div>
  
          {/* Quadrant 4: AI Insights (placeholder) */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-xl text-white">
            <h2 className="text-xl font-bold mb-2">🤖 AI Insight</h2>
            <p className="text-sm text-indigo-100 italic mb-2">"Based on historical earnings surprises, AAPL has a 72% probability of beating estimates."</p>
            <p className="text-xs text-indigo-200">Model: LSTM v2.3 | Last trained: 2025-07-18</p>
          </div>
  
        </div>
      </div>
    );
  }
  
  export default QuadrantView;
  