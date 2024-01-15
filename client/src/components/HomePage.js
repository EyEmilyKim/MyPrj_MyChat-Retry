import { useContext } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { UserContext } from '../contexts/UserContext';
import './HomePage.css';
import Login from './Login';
import Logout from './Logout';

export default function HomePage() {
  const { isLogin } = useContext(LoginContext);
  const { user } = useContext(UserContext);
  console.log('isLogin', isLogin);
  console.log('user', user);

  return (
    <div className="home-body">
      <h1 className="home-title">MyApp-test HomePage</h1>

      {!isLogin ? (
        <div className="nonLoggedIn-area">
          <Login />
        </div>
      ) : (
        <div className="loggedIn-area">
          <p className="welcome-userName">
            반갑습니다 {user.name || user.email}님~~ !
          </p>
          <Logout />
        </div>
      )}
    </div>
  );
}
