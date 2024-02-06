import { useContext } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import axios from 'axios';
import { handleHttpError } from '../utils/handleHttpError';

export default function useLogin(email, password) {
  const { setUser, setIsLogin, setLoginOperating } = useContext(LoginContext);
  const apiRoot = process.env.REACT_APP_API_ROOT;

  // 로그인 이벤트 처리하는 함수
  const handleLogin = async () => {
    // console.log('handleLogin called', email);
    setLoginOperating(true);
    try {
      const res = await axios({
        url: `${apiRoot}/user/login`,
        method: 'POST',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          email: email,
          password: password,
        },
      });
      if (res.status === 200) {
        alert(`로그인 성공 !\n반갑습니다 ${res.data.user.name}님~~`);
        console.log('로그인 성공 !');
        setUser(res.data.user);
        setIsLogin(true);
      }
    } catch (error) {
      const notify = true;
      handleHttpError(error, notify);
    } finally {
      setLoginOperating(false);
    }
  };

  return {
    handleLogin,
  };
}
