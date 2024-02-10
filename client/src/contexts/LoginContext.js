import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { handleHttpError } from '../utils/handleHttpError';
import useStateLogger from '../hooks/useStateLogger';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const apiRoot = process.env.REACT_APP_API_ROOT;
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isAuthing, setIsAuthing] = useState(true);
  const [loginOperating, setLoginOperating] = useState(false);
  useStateLogger(user, 'user');
  // useStateLogger(isLogin, 'isLogin');
  // useStateLogger(isAuthing, 'isAuthing');
  // useStateLogger(loginOperating, 'loginOperating');

  // 로그인 인증
  const Authenticate = async () => {
    // console.log('[]useEffect - Auth called');
    try {
      const res = await axios({
        url: `${apiRoot}/user/auth`,
        method: 'GET',
        withCredentials: true,
      });
      if (res.data) {
        setIsLogin(true);
        setUser(res.data.user);
      }
    } catch (error) {
      const notify = false;
      handleHttpError(error, notify);
    } finally {
      setIsAuthing(false);
    }
  };

  useEffect(() => {
    Authenticate();
  }, []);

  const contextValue = {
    isLogin, // for SocketContext, PrivateRoutes, NavBar, HomePage
    isAuthing, // for SocketContext, HomePage
    loginOperating, // for SocketContext, HomePage
    user, // for ...
    setLoginOperating, // for SocketContext
    setIsLogin, // for Login, Logout
    setUser, // for Login, Logout, UserList
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};
