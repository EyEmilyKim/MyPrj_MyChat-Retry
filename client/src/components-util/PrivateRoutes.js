import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContext';
import { SocketContext } from '../contexts/SocketContext';
import useStateLogger from '../hooks/useStateLogger';
import Loader from './Loader';

const PrivateRoutes = () => {
  const { isLogin, isAuthing } = useContext(LoginContext);
  const { isConnecting } = useContext(SocketContext);
  const [canNavigate, setCanNavigate] = useState(false);
  // useStateLogger(canNavigate, 'canNavigate');

  useEffect(() => {
    // 인증 후 비로그인 시 이동
    if (!isAuthing && !isLogin) {
      setCanNavigate(true);
    }
  }, [isAuthing]);

  useEffect(() => {
    // 소켓 연결 후 이동
    if (!isConnecting) {
      setCanNavigate(true);
    }
  }, [isConnecting]);

  return !canNavigate ? (
    <Loader />
  ) : isLogin ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoutes;
