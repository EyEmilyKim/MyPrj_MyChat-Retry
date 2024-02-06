import React, { useEffect, useRef, useState } from 'react';
import usePasswordConfirm from '../../hooks/usePasswordConfirm';
import './PasswordConfirm.css';

export default function PasswordConfirm(props) {
  const setIsConfirmed = props.setIsConfirmed;
  const [password, setPassword] = useState('');

  const focusRef = useRef();
  useEffect(() => {
    focusRef.current.focus();
  }, []);

  const { handlePasswordConfirm } = usePasswordConfirm(
    password,
    setIsConfirmed
  );

  return (
    <div className="pwConf-main">
      <p className="pwConf-form-label">현재 비밀번호 : </p>
      <div className="pwConf-form-row">
        <input
          ref={focusRef}
          type="password"
          placeholder="****"
          className="pwConf-input"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          rows={1}
        />
        <button
          className="pwConf-button"
          disabled={password === ''}
          onClick={handlePasswordConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
}
