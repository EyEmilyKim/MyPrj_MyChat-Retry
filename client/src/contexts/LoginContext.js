import { createContext, useState } from 'react';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);

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
