import axios from 'axios';
import { useState } from 'react';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  console.log("isLogin", isLogin);
  console.log("user", user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('handleLogin called', email);

    try {
      const res = await axios({
        url: 'http://localhost:1234/login',
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
        setIsLogin(true);
        setUser(res.user);
      } else {
        alert(res.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} className="login-container">
        <input
          placeholder="이메일"
          className="login-input"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          multiline={false}
          rows={1}
        />
        <input
          placeholder="비밀번호"
          className="login-input"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          multiline={false}
          rows={1}
        />
        <button
          className="login-button"
          disabled={email === '' || password === ''}
          type="submit"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
