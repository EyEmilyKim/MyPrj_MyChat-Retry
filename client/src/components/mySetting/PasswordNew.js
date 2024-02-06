import React, { useContext, useEffect, useRef, useState } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
import { alertDeveloping } from '../../utils/alertDeveloping';
import './PasswordNew.css';

export default function PasswordNew() {
  const { user } = useContext(LoginContext);
  const email = user.email;
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const focusRef = useRef();
  useEffect(() => {
    focusRef.current.focus();
  }, []);

  const handlePasswordNew = () => {
    alertDeveloping('handlePasswordNew');
  };

  return (
    <div className="pwNew-main">
      <div>
        <p className="pwNew-form-label">새 비밀번호 : </p>
        <input
          ref={focusRef}
          type="password"
          placeholder="****"
          className="pwNew-input"
          value={password1}
          onChange={(event) => {
            setPassword1(event.target.value);
          }}
          rows={1}
        />
      </div>
      <div>
        <p className="pwNew-form-label">새 비밀번호 확인: </p>
        <input
          type="password"
          placeholder="****"
          className="pwNew-input"
          value={password2}
          onChange={(event) => {
            setPassword2(event.target.value);
          }}
          rows={1}
        />
      </div>
      <button
        className="pwNew-button"
        disabled={
          password1 === '' || password2 === '' || password1 !== password2
        }
        onClick={handlePasswordNew}
      >
        확인
      </button>
    </div>
  );
}
