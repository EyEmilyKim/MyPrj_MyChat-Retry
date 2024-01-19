import { useContext } from 'react';
import { LoginContext } from '../contexts/LoginContext';

export default function Logout() {
  const { handleLogout } = useContext(LoginContext);

  return (
    <div>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}
