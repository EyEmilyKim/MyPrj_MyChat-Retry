import { serveUserAxios } from '../utils/serveUserAxios';

export default function useSignup(email, password, userName) {
  const apiRoot = process.env.REACT_APP_API_ROOT;

  // 유저 등록 이벤트 처리하는 함수
  const handleSignUp = async () => {
    console.log('handleSignUp called', email);

    try {
      const resNotify = true;

      await serveUserAxios(
        {
          url: `${apiRoot}/user/signup`,
          method: 'POST',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            email: email,
            password: password,
            userName: userName,
          },
        },
        resNotify
      );
    } catch (error) {
      // console.log('handleSignUp error', error);
    }
  };

  return {
    handleSignUp,
  };
}
