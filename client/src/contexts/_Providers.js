import { LoginProvider } from './LoginContext';
import { SocketProvider } from './SocketContext';
import { DataProvider } from './DataContext';

export const Providers = ({ children }) => {
  return (
    <LoginProvider>
      <SocketProvider>
        <DataProvider>{children}</DataProvider>
      </SocketProvider>
    </LoginProvider>
  );
};
