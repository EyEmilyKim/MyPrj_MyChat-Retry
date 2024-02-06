import { serveUserAxios } from '../utils/serveUserAxios';

export default function usePasswordConfirm(password, setIsConfirmed) {
  const apiRoot = process.env.REACT_APP_API_ROOT;

  // 비밀번호 확인 이벤트 처리하는 함수
  const handlePasswordConfirm = async () => {
    // console.log('handlePasswordConfirm called');

    try {
      const resNotify = true;
      const res = await serveUserAxios(
        {
          url: `${apiRoot}/user/password-confirm`,
          method: 'POST',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            password: password,
          },
        },
        resNotify
      );
      if (res.status === 200) setIsConfirmed(true);
    } catch (error) {
      // console.log('handlePasswordConfirm error', error);
    }
  };

  return {
    handlePasswordConfirm,
  };
}
