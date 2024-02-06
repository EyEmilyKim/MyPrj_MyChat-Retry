import { useEffect, useRef, useState, useContext } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
import axios from 'axios';
import { handleHttpError } from '../../utils/handleHttpError';
import './Login.css';

export default function Login() {
  const { setUser, setIsLogin, setLoginOperating } = useContext(LoginContext);
  const apiRoot = process.env.REACT_APP_API_ROOT;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const focusRef = useRef();

  useEffect(() => {
    focusRef.current.focus();
  }, []);

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
        alert('유저 등록 성공 !', res.data.user);
        console.log('유저 등록 성공 !', res.data.user);
      } else {
        alert('유저 등록 성공..', res.error);
        console.log('유저 등록 실패..', res.error);
      }
    } catch (error) {
      console.error('SignUp failed:', error);
      alert('SignUp failed. Please try again.');
    }
  };

  return (
    <div>
      <div className="login-container">
        <input
          ref={focusRef}
          placeholder="이메일"
          className="login-input"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          rows={1}
        />
        <input
          placeholder="비밀번호"
          className="login-input"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          rows={1}
        />
        <input
          placeholder="닉네임"
          className="login-input"
          value={userName}
          onChange={(event) => {
            setUserName(event.target.value);
          }}
          rows={1}
        />
        <button
          className="login-button"
          disabled={email === '' || password === ''}
          onClick={handleLogin}
        >
          로그인
        </button>
        <button
          className="signUp-button"
          disabled={email === '' || password === '' || userName === ''}
          onClick={handleSignUp}
        >
          등록
        </button>
      </div>
    </div>
  );
}
