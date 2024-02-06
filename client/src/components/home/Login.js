import { useEffect, useRef, useState } from 'react';
import './Login.css';
import useLogin from '../../hooks/useLogin';
import useSignup from '../../hooks/useSignup';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');

  const focusRef = useRef();
  useEffect(() => {
    focusRef.current.focus();
  }, []);

  const { handleLogin } = useLogin(email, password);
  const { handleSignUp } = useSignup(email, password, userName);

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
