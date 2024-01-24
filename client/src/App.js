import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Providers } from './contexts/_Providers';
import PrivateRoutes from './utils/PrivateRoutes';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import UserList from './components/UserList';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route element={<PrivateRoutes />}>
            <Route exact path="/userList" element={<UserList />} />
            <Route exact path="/roomList" element={<RoomList />} />
            <Route exact path="/room/:id" element={<ChatRoom />} />
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
