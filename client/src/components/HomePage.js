import { useContext, useEffect } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import './HomePage.css';
import Login from './Login';
import Logout from './Logout';

export default function HomePage() {
  const { isLogin, setIsLogin } = useContext(LoginContext);
  const { user, setUser } = useContext(UserContext);
  console.log('isLogin', isLogin);
  console.log('user', user);

  useEffect(() => {
    try {
      axios({
        url: 'http://localhost:1234/user/login/success',
        method: 'GET',
        withCredentials: true,
      })
        .then((result) => {
          if (result.data) {
            setIsLogin(true);
            setUser(result.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [isLogin]);

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
