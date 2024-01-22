import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { Navigate, Outlet } from 'react-router-dom';
import { SocketContext } from '../contexts/SocketContext';
import './PrivateRoutes.css';

const PrivateRoutes = () => {
  const { isLogin, isAuthing } = useContext(LoginContext);
  const { isConnecting } = useContext(SocketContext);
  const [canNavigate, setCanNavigate] = useState(false);
  // console.log('isAuthing', isAuthing);
  // console.log('isConnecting', isConnecting);
  // console.log('canNavigate', canNavigate);

  useEffect(() => {
    const checkNavigation = async () => {
      if (!isAuthing && !isConnecting) {
        setCanNavigate(true);
      }
    };
    checkNavigation();
  }, [isAuthing, isConnecting]);

  return isAuthing ? (
    <div className="loader-area">
      <span className="loader">Load&nbsp;ng</span>
    </div>
  ) : canNavigate ? (
    isLogin ? (
      <Outlet />
    ) : (
      <Navigate to="/" replace />
    )
  ) : null;
};

export default PrivateRoutes;
