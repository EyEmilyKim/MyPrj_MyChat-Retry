import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { Navigate, Outlet } from 'react-router-dom';
import { SocketContext } from '../contexts/SocketContext';
import './PrivateRoutes.css';
import Loader from './Loader';
import useStateLogger from '../hooks/useStateLogger';

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
