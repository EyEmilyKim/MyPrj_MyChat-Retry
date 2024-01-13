import { LoginProvider } from './LoginContext';
import { UserProvider } from './UserContext';
import { SocketProvider } from './SocketContext';

export const Providers = ({ children }) => {
  return (
    <LoginProvider>
      <UserProvider>
        <SocketProvider>{children}</SocketProvider>
      </UserProvider>
    </LoginProvider>
  );
};
