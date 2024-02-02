import { useContext } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import axios from 'axios';
import { handleHttpError } from '../utils/handleHttpError';

export default function Logout() {
  const { setIsLogin, setUser } = useContext(LoginContext);
  const apiRoot = process.env.REACT_APP_API_ROOT;

  // 로그아웃 이벤트 처리하는 함수
  const handleLogout = async () => {
    // console.log('handleLogout called');
    try {
      const res = await axios({
        url: `${apiRoot}/user/logout`,
        method: 'POST',
        withCredentials: true,
      });
      if (res.status === 200) {
        alert(`로그아웃 성공!\n또 만나요 ${res.data.user.name}님~~`);
        console.log('로그아웃 성공!');
        setIsLogin(false);
        setUser(null);
      }
    } catch (error) {
      const notify = true;
      handleHttpError(error, notify);
    }
  };

  return (
    <div>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}
