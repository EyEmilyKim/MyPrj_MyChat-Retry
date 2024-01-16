import { useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export default function Logout() {
  const { handleSocketLogout } = useContext(SocketContext);

  const handleLogout = () => {
    // console.log('Logout handleLogout called');
    handleSocketLogout();
  };

  return (
    <div>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}
