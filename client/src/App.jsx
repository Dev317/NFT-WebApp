import Home from './components/Home';
import { EthProvider } from './context/EthContext';

function App() {
  return (
    <EthProvider>
      <Home />
    </EthProvider>
  );
}

export default App;
