import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const path = 'http://localhost:1234/user';
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthing, setIsAuthing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // useEffect(() => {
  //   console.log('[isLogin] - isLogin', isLogin);
  // }, [isLogin]);
  // useEffect(() => {
  //   console.log('[isAuthing] - isAuthing', isAuthing);
  // }, [isAuthing]);
  // useEffect(() => {
  //   console.log('[isLoggingIn] - isLoggingIn', isLoggingIn);
  // }, [isLoggingIn]);

  // 로그인 이벤트 처리하는 함수
  const handleLogin = async (email, password) => {
    console.log('handleLogin called', email);
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
      handleError(error, notify);
      setIsLoggingIn(false);
    }
  };

  // 로그아웃 이벤트 처리하는 함수
  const handleLogout = async () => {
    console.log('handleLogout called');
    try {
      const res = await axios({
        url: `${path}/logout`,
        method: 'POST',
        withCredentials: true,
      });
      if (res.status === 200) {
        alert(`로그아웃 성공!\n또 만나요 ${res.data.user.name}님~~`);
        console.log('로그아웃 성공!');
        setIsLogin(false);
        setUser(null);
      }
    } catch (error) {
      const notify = true;
      handleError(error, notify);
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
        handleError(error, notify);
        setIsAuthing(false);
      } finally {
        setIsAuthing(false);
      }
    };

    Authenticate();
  }, []);

  // 에러 메시지 처리하는 함수
  const handleError = async (error, notify) => {
    if (error.response) {
      //응답코드 2xx 가 아닌 경우
      console.log('Error response:', error.response.data);
      if (notify) alert(error.response.data.error);
    } else if (error.request) {
      //요청이 전혀 이루어지지 않은 경우
      console.log('Error request:', error.request);
    } else {
      //예상치 못한 에러
      console.log('Error:', error);
      alert(error);
    }
  };

  const contextValue = {
    isLogin, // for PrivateRoutes
    isAuthing, // for PrivateRoutes
    isLoggingIn, // for HomePage
    user, // for HomePage
    handleLogin, // for Login(HomePage)
    handleLogout, // for Logout(HomePage)
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};
