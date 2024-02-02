import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { LoginContext } from './LoginContext';
import useStateLogger from '../hooks/useStateLogger';

// SocketContext 생성
export const SocketContext = createContext();

// SocketProvider 컴포넌트 생성
export const SocketProvider = ({ children }) => {
  const { isLogin, isAuthing, loginOperating } = useContext(LoginContext);
  const ioUrl = process.env.REACT_APP_API_ROOT;
  const originUrl = process.env.REACT_APP_ORIGIN_ROOT;
  const [socket, setSocket] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  useStateLogger(socket, 'socket');
  useStateLogger(isConnecting, 'isConnecting');

  // 소켓 생성하는 함수
  const connectSocket = (reason) => {
    console.log(`${reason} 후 소켓 연결`);
    if (!socket || socket.disconnected) {
      // 연결된 소켓 없으면 새로 생성
      setIsConnecting(true);
      const newSocket = io(ioUrl, {
        withCredentials: true,
        origins: originUrl,
        query: {
          reason: reason,
        },
      });
      newSocket.on('connect_error', (error) => {
        console.log('소켓 연결 error', error);
        setIsConnecting(false);
      });
      newSocket.on('connect', () => {
        console.log('소켓 연결 성공 !');
        setSocket(newSocket);
        setIsConnecting(false);
      });
    } else {
      // 이미 연결된 소켓 존재하면 그대로 반환
      console.log('기존 소켓 반환', socket.id);
      return socket;
    }
  };

  useEffect(() => {
    if (isLogin) {
      // 로그인 성공 후 소켓 연결
      connectSocket('로그인');
    }
  }, [loginOperating]);

  useEffect(() => {
    if (isLogin) {
      // 인증 성공 후 소켓 연결
      connectSocket('인증성공');
    }
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
  }, [isLogin]);

  useEffect(() => {
    //컴포넌트 언마운트 시 소켓 정리
    return () => {
      if (socket) {
        console.log('SocketContext 언마운트 소켓 정리');
        socket.disconnect();
        console.log(socket);
      }
    };
  }, []);

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
