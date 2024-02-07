import { useContext } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { serveUserAxios } from '../utils/serveUserAxios';

export default function useLogin(email, password) {
  const { setUser, setIsLogin, setLoginOperating } = useContext(LoginContext);
  const apiRoot = process.env.REACT_APP_API_ROOT;

  // 로그인 이벤트 처리하는 함수
  const handleLogin = async () => {
    // console.log('handleLogin called', email);
    setLoginOperating(true);
    try {
      const resNotify = false;
      const res = await serveUserAxios(
        {
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
        },
        resNotify
      );
      if (res.status === 200) {
        setUser(res.data.user);
        setIsLogin(true);
      }
    } catch (error) {
      // console.log('handleLogin error', error);
    } finally {
      setLoginOperating(false);
    }
  };

  return {
    handleLogin,
  };
}
