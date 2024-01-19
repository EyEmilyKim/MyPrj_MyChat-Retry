import { useContext } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const { isLogin } = useContext(LoginContext);
  console.log('isLogin', isLogin);

  return isLogin ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoutes;
