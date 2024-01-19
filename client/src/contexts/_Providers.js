import { LoginProvider } from './LoginContext';
import { SocketProvider } from './SocketContext';

export const Providers = ({ children }) => {
  return (
    <LoginProvider>
      <SocketProvider>{children}</SocketProvider>
    </LoginProvider>
  );
};
