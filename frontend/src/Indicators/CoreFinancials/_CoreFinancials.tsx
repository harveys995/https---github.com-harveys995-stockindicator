import MA from "./MA";
import Price from "./Price";
import TickerSearch from "../TickerSearch";

function CoreFinancials() {
    return (
      <div className="bg-transparent flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
          <div className="col-span-5">
            <TickerSearch/>
          </div>
  
          <div className="col-span-5 text-2xl">Core Financials</div>

          <div className="col-span-1">
            <Price />
          </div>
  
          <div className="col-span-2">
          <MA />
          </div>
  
        </div>
      </div>
    );
  }
  
  export default CoreFinancials;
  