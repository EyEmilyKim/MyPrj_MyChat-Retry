import { serveUserAxios } from '../utils/serveUserAxios';

export default function usePasswordNew(params) {
  const email = params.email;
  const password = params.password1;
  const setIsConfirmed = params.setIsConfirmed;
  const toggleSetting = params.toggleSetting;
  const apiRoot = process.env.REACT_APP_API_ROOT;

  // 비밀번호 확인 이벤트 처리하는 함수
  const handlePasswordNew = async () => {
    // console.log('handlePasswordNew called');

    try {
      const resNotify = true;
      await serveUserAxios(
        {
          url: `${apiRoot}/user/password-reset`,
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
      setIsConfirmed(false);
      toggleSetting();
    } catch (error) {
      // console.log('handlePasswordNew error', error);
    }
  };

  return {
    handlePasswordNew,
  };
}
