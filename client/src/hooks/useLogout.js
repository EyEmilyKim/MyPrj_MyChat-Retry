import { useLoginContext } from '../contexts/LoginContext';
import { serveUserAxios } from '../utils/serveUserAxios';

export default function useLogout() {
  const { setIsLogin, setUser } = useLoginContext();
  const apiRoot = process.env.REACT_APP_API_ROOT;

  // 로그아웃 이벤트 처리하는 함수
  const handleLogout = async () => {
    console.log('handleLogout called');
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        const resNotify = true;
        const res = await serveUserAxios(
          {
            url: `${apiRoot}/user/logout`,
            method: 'POST',
            withCredentials: true,
          },
          resNotify
        );
        if (res.status === 200) {
          setIsLogin(false);
          setUser(null);
        }
      } catch (error) {
        // console.log('handleLogout error', error);
      }
    }
  };

  return {
    handleLogout,
  };
}
