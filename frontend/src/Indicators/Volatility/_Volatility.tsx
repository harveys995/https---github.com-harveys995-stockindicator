import ATR from "./ATR";
import Beta from "./Beta";
import SD from "./SD";


function Volatility() {
    return (
      <div className="bg-transparent flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        <div className="col-span-4 text-2xl">Volatility</div>

          <div className="col-span-1">
          <Beta />
          </div>

          <div className="col-span-1">
            <SD />
          </div>

          <div className="col-span-1">
            <ATR />
          </div>
  
        </div>
      </div>
    );
  }
  
  export default Volatility;
  