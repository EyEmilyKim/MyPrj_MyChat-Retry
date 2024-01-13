import axios from 'axios';
import { useEffect, useRef, useState, useContext } from 'react';
import './Login.css';
import { LoginContext } from '../contexts/LoginContext';
import { UserContext } from '../contexts/UserContext';
import { SocketContext } from '../contexts/SocketContext';

export default function Login() {
  const { isLogin } = useContext(LoginContext);
  const { user } = useContext(UserContext);
  console.log('isLogin', isLogin);
  console.log('user', user);
  const { socket, handleSocketLogin } = useContext(SocketContext);
  console.log('socket', socket);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const emailRef = useRef();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleLogin = async () => {
    console.log('Login handleLogin called', email);
    handleSocketLogin(email, password);
  };

  const handleSignUp = async () => {
    console.log('handleSignUp called', email);

    try {
      const res = await axios({
        url: 'http://localhost:1234/user/signup',
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
          ref={emailRef}
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
