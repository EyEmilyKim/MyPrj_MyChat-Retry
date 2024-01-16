import { LoginProvider } from './LoginContext';
import { UserProvider } from './UserContext';
import { SocketProvider } from './SocketContext';

export const Providers = ({ children }) => {
  return (
    <UserProvider>
      <LoginProvider>
        <SocketProvider>{children}</SocketProvider>
      </LoginProvider>
    </UserProvider>
  );
};
