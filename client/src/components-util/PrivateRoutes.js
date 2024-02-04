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
    const checkNavigation = async () => {
      if (!isAuthing && !isConnecting) {
        setCanNavigate(true);
      }
    };
    checkNavigation();
  }, [isAuthing]);

  return isAuthing ? (
    <Loader />
  ) : canNavigate ? (
    isLogin ? (
      <Outlet />
    ) : (
      <Navigate to="/" replace />
    )
  ) : null;
};

export default PrivateRoutes;
