import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const path = 'http://localhost:1234/user';
  const [isLogin, setIsLogin] = useState(false);
  console.log('isLogin', isLogin);
  const [user, setUser] = useState(null);
  const [isAuthing, setIsAuthing] = useState(true);

  // 로그인 이벤트 처리하는 함수
  const handleLogin = async (email, password) => {
    console.log('handleLogin called', email);
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
        alert('로그인 성공 !');
        setIsLogin(true);
        setUser(res.data.user);
      }
    } catch (error) {
      const notify = true;
      handleError(error, notify);
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
        alert('로그아웃 성공!');
        setIsLogin(false);
        setUser(null);
      }
    } catch (error) {
      const notify = true;
      handleError(error, notify);
    }
  };

  useEffect(() => {
    console.log('isAuthing', isAuthing);
  }, [isAuthing]);

  useEffect(() => {
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
    isLogin,
    setIsLogin,
    isAuthing,
    setIsAuthing,
    user,
    handleLogin,
    handleLogout,
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};
