import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { LoginContext } from './LoginContext';

// SocketContext 생성
export const SocketContext = createContext();

// SocketProvider 컴포넌트 생성
export const SocketProvider = ({ children }) => {
  const ioUrl = 'http://localhost:1234';
  const originUrl = 'http://localhost:3000';
  const [socket, setSocket] = useState(null);
  console.log('socket', socket);
  const { isLogin } = useContext(LoginContext);

  // 소켓 생성하는 함수
  const createSocket = () => {
    // 이미 소켓 존재하면 그대로 반환
    if (socket) {
      return socket;
    } else {
      // 없으면 새로운 소켓 생성
      const newSocket = io(ioUrl, {
        withCredentials: true,
        origins: originUrl,
      });
      newSocket.on('connect_error', (error) => {
        console.log('newSocket error', error);
      });
      console.log('createSocket() done');
      return newSocket;
    }
  };

  useEffect(() => {
    if (isLogin) {
      // 로그인 후 소켓 없으면 새 소켓 연결
      console.log('로그인 후 소켓 없으면 새 소켓 연결');
      if (!socket) {
        const newSocket = createSocket();
        setSocket(newSocket);
      }
    } else if (isLogin == false) {
      // 로그아웃 후 소켓 정리
      if (socket) {
        console.log('로그아웃 후 소켓 정리');
        socket.emit('logout');
        socket.disconnect();
      }
    }

    //컴포넌트 언마운트 시 기존 소켓 정리
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isLogin]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
