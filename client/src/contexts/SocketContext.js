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
  const { isLogin, isAuthing } = useContext(LoginContext);
  const [isConnecting, setIsConnecting] = useState(false);
  // useEffect(() => {
  //   console.log('[socket]', socket);
  // }, [socket]);
  // useEffect(() => {
  //   console.log('isConnecting', isConnecting);
  // }, [isConnecting]);

  // 소켓 생성하는 함수
  const createSocket = (reason) => {
    // 이미 소켓 존재하면 그대로 반환
    if (socket) {
      return socket;
    } else {
      setIsConnecting(true);
      // 없으면 새로운 소켓 생성
      const newSocket = io(ioUrl, {
        withCredentials: true,
        origins: originUrl,
        query: {
          reason: reason,
        },
      });
      newSocket.on('connect_error', (error) => {
        console.log('newSocket error', error);
        setIsConnecting(false);
      });
      newSocket.on('connect', () => {
        console.log('소켓 연결 성공 !');
        setIsConnecting(false);
      });
      return newSocket;
    }
  };

  useEffect(() => {
    if (isLogin) {
      // 인증성공 후 소켓 연결
      console.log('인증성공 후 소켓 연결');
      if (socket) {
        return socket;
      } else {
        const newSocket = createSocket('auth');
        setSocket(newSocket);
      }
    }
    //컴포넌트 언마운트 시 소켓 정리
    return () => {
      if (socket) {
        console.log('SocketContext 언마운트 소켓 정리 A');
        socket.disconnect();
        console.log(socket);
      }
    };
  }, [isAuthing]);

  useEffect(() => {
    if (isLogin == false) {
      // 로그아웃 후 소켓 정리
      if (socket) {
        console.log('로그아웃 후 소켓 정리');
        socket.emit('logout');
        socket.disconnect();
        console.log(socket);
      }
    }
    //컴포넌트 언마운트 시 소켓 정리
    return () => {
      if (socket) {
        console.log('SocketContext 언마운트 소켓 정리 B');
        socket.disconnect();
        console.log(socket);
      }
    };
  }, [isLogin]);

  // 소켓 이벤트 처리
  if (socket) {
    // // 연결 해제 메시지 수신
    // socket.on('disconnectMessage', (message) => {
    //   alert(message);
    //   console.log(message);
    // });
  }

  const contextValue = {
    socket,
    isConnecting, // for PrivateRoutes
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
