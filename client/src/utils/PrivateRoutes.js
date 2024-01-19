import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { Navigate, Outlet } from 'react-router-dom';
import { SocketContext } from '../contexts/SocketContext';

const PrivateRoutes = () => {
  const { isLogin, isAuthing } = useContext(LoginContext);
  const { isConnecting } = useContext(SocketContext);
  const [canNavigate, setCanNavigate] = useState(false);
  console.log('isAuthing', isAuthing);
  console.log('isConnecting', isConnecting);
  console.log('canNavigate', canNavigate);

  useEffect(() => {
    const checkNavigation = async () => {
      if (!isAuthing && !isConnecting) {
        setCanNavigate(true);
      }
    };
    checkNavigation();
  }, [isAuthing, isConnecting]);

  return isAuthing ? (
    <h1>Loading...</h1>
  ) : canNavigate ? (
    isLogin ? (
      <Outlet />
    ) : (
      <Navigate to="/" replace />
    )
  ) : (
    <h1>Loading...</h1>
  );
};

export default PrivateRoutes;
