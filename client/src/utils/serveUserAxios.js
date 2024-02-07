import axios from 'axios';
import { handleHttpError } from './handleHttpError';

// 공통된 axios 요청, 결과 처리하는 함수
// for Login, Logout, Signup
const serveUserAxios = async (config, resNotify) => {
  try {
    const res = await axios(config);
    if (res.status === 200) {
      alert(res.data.message);
      if (resNotify) console.log(`${res.data.message}`, res.data.user);
    }
    return res;
  } catch (error) {
    handleHttpError(error, resNotify);
  }
};

export { serveUserAxios };
