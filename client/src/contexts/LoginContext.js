import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import useStateLogger from '../hooks/useStateLogger';
import { handleHttpError } from '../utils/handleHttpError';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const path = 'http://localhost:1234/user';
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isAuthing, setIsAuthing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useStateLogger(user, 'user');
  // useStateLogger(isLogin, 'isLogin');
  // useStateLogger(isAuthing, 'isAuthing');
  // useStateLogger(isLoggingIn, 'isLoggingIn');

  // 로그인 이벤트 처리하는 함수
  const handleLogin = async (email, password) => {
    // console.log('handleLogin called', email);
    setIsLoggingIn(true);
    try {
      const res = await axios({
        url: `${path}/login`,
        method: 'POST',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          email: email,
          password: password,
        },
      });
      if (res.status === 200) {
        alert(`로그인 성공 !\n반갑습니다 ${res.data.user.name}님~~`);
        console.log('로그인 성공 !');
        setIsLogin(true);
        setUser(res.data.user);
        setIsLoggingIn(false);
        window.location.reload(); // 소켓auth연결 위해 적정 페이지로 이동(or새로고침)필요
      }
    } catch (error) {
      const notify = true;
      handleHttpError(error, notify);
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    // console.log('[]useEffect - Auth called');
    // 로그인 인증
    const Authenticate = async () => {
      try {
        const res = await axios({
          url: `${path}/auth`,
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
        setIsAuthing(false);
      } finally {
        setIsAuthing(false);
      }
    };

    Authenticate();
  }, []);

  const contextValue = {
    isLogin, // for PrivateRoutes, Login/Logout(HomePage)
    isAuthing, // for PrivateRoutes
    loginOperated, // for Login(HomePage)
    user, // for HomePage, ChatRoom
    setLoginOperated, // for Login(HomePage)
    setIsLogin, // for Login/Logout(HomePage)
    setUser, // for Login/Logout(HomePage)
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};
