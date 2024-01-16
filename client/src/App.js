import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Providers } from './contexts/_Providers';
import HomePage from './components/HomePage';
import UserList from './components/UserList';
import NavBar from './components/NavBar';

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/userList" element={<UserList />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
