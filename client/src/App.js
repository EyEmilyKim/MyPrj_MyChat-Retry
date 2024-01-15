import HomePage from './components/HomePage';
import { Providers } from './contexts/_Providers';

function App() {
  return (
    <Providers>
      <div className="App">
        <HomePage />
      </div>
    </Providers>
  );
}

export default App;
