import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { LoginContext } from './LoginContext';
import { UserContext } from './UserContext';

// SocketContext 생성
export const SocketContext = createContext();

// SocketProvider 컴포넌트 생성
export const SocketProvider = ({ children }) => {
  const ioUrl = 'http://localhost:5001';
  const [socket, setSocket] = useState(null);
  const { setIsLogin } = useContext(LoginContext);
  const { setUser } = useContext(UserContext);

  // 로그인 이벤트 처리하는 함수
  const handleSocketLogin = async (email, password) => {
    console.log('Socket handleLogin called', email);

    try {
      const res = await axios({
        url: 'http://localhost:1234/user/login',
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
        alert('로그인 성공 !', res.data.user);
        console.log('로그인 성공 !', res.data.user);
        setIsLogin(true);
        setUser(res.data.user);
        //토큰 받아오는 로직 필요
        //Socket.IO 연결 및 토큰 인증
        const newSocket = io(ioUrl, {
          auth: {},
        });
        setSocket(newSocket);
      } else {
        alert('로그인 실패..', res.error);
        console.log('로그인 실패..', res.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  useEffect(() => {
    //컴포넌트 언마운트 시 Socket.IO 연결 해제
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Socket Context 값
  const ContextValue = {
    socket,
    handleSocketLogin,
  };

  return (
    <SocketContext.Provider value={ContextValue}>
      {children}
    </SocketContext.Provider>
  );
};
