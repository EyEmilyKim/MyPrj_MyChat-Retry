import Login from './components/Login';
import { Providers } from './contexts/_Providers';

function App() {
  return (
    <Providers>
      <div className="App">
        <Login />
      </div>
    </Providers>
  );
}

export default App;
