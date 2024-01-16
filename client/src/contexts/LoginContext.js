import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    try {
      axios({
        url: 'http://localhost:1234/user/login/success',
        method: 'GET',
        withCredentials: true,
      })
        .then((result) => {
          if (result.data) {
            setIsLogin(true);
            setUser(result.data.user);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const contextValue = {
    isLogin,
    setIsLogin,
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};
