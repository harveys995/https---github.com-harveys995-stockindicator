import './BreathingBackground/BreathingBackground.css'
import BreathingBackground from './BreathingBackground/BreathingBackground';
import { CalculateSPYSharpe } from './Components/CalculateSPYSharpe';
import ETFSelector from './Components/ETFSelector';

function App() {
  return (
    <div className="flex flex-col justify-center p-6 gap-6">
      <BreathingBackground/>
      <ETFSelector />
      <CalculateSPYSharpe />
    </div>
  );
  
}

export default App;
