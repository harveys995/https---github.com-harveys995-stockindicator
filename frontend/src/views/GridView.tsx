import Beta from "./Beta";
import MA from "./MA";
import Price from "./Price";
import TickerSearch from "./TickerSearch";

function QuadrantView() {
    return (
      <div className="bg-transparent flex justify-center">
        <div className="grid grid-cols-4 gap-6 w-full">
          
          <div className="col-span-4">
            <TickerSearch/>
          </div>
  
          <div className="col-span-1">
            <Price />
          </div>
  
          <div className="col-span-1">
          <MA />
          </div>

          <div className="col-span-1">
          <Beta />
          </div>
  
          {/* Quadrant 4: AI Insights (placeholder) */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-xl text-white">
            <h2 className="text-xl font-bold mb-2">🤖 AI Insight</h2>
            <p className="text-sm text-indigo-100 italic mb-2">"Based on historical..."</p>
            <p className="text-xs text-indigo-200">Model: LSTM v2.3 | Last trained: 2025-07-18</p>
          </div>
  
        </div>
      </div>
    );
  }
  
  export default QuadrantView;
  