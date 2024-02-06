import { useContext } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { serveUserAxios } from '../utils/serveUserAxios';

export default function useResign() {
  const { setIsLogin, setUser } = useContext(LoginContext);
  const apiRoot = process.env.REACT_APP_API_ROOT;

  // 계정삭제 이벤트 처리하는 함수
  const handleResign = async () => {
    console.log('handleResign called');
    const confirm = window.confirm(
      '삭제한 계정은 복구할 수 없습니다.\n정말 진행하시겠습니까?'
    );
    if (confirm) {
      try {
        const resNotify = true;
        const res = await serveUserAxios(
          {
            url: `${apiRoot}/user/resign`,
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
        // console.log('handleResign error', error);
      }
    }
  };

  return {
    handleResign,
  };
}
