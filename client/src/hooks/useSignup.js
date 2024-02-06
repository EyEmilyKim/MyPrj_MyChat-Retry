import axios from 'axios';
import { handleHttpError } from '../utils/handleHttpError';

export default function useSignup(email, password, userName) {
  const apiRoot = process.env.REACT_APP_API_ROOT;

  // 유저 등록 이벤트 처리하는 함수
  const handleSignUp = async () => {
    console.log('handleSignUp called', email);

    try {
      const res = await axios({
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
      });

      if (res.status === 200) {
        alert('유저 등록 성공 !', res.data.message);
        console.log('유저 등록 성공 !', res.data.message, res.data.user);
      }
    } catch (error) {
      const notify = true;
      handleHttpError(error, notify);
    }
  };

  return {
    handleSignUp,
  };
}
