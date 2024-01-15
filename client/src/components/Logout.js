import { useContext } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { UserContext } from '../contexts/UserContext';

export default function Logout() {
  const { setIsLogin } = useContext(LoginContext);
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    setIsLogin(false);
    setUser(null);
    console.log('로그아웃');
  };

  return (
    <div>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃 임시
      </button>
    </div>
  );
}
