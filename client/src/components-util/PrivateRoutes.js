import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContext';
import { SocketContext } from '../contexts/SocketContext';
import useStateLogger from '../hooks/useStateLogger';
import Loader from './Loader';

const PrivateRoutes = () => {
  const { isLogin } = useContext(LoginContext);
  const { isConnecting } = useContext(SocketContext);
  const [canNavigate, setCanNavigate] = useState(false);
  // useStateLogger(canNavigate, 'canNavigate');

  useEffect(() => {
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
