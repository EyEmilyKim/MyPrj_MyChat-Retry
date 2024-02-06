import React, { useEffect, useRef, useState } from 'react';
import './PasswordConfirm.css';
import { alertDeveloping } from '../../utils/alertDeveloping';

export default function PasswordConfirm() {
  const [password, setPassword] = useState('');

  const focusRef = useRef();
  useEffect(() => {
    focusRef.current.focus();
  }, []);

  const handlePasswordConfirm = () => {
    alertDeveloping('handlePasswordConfirm');
  };

  return (
    <div className="pwConf-main">
      <p className="pwConf-form-label">현재 비밀번호 : </p>
      <div className="pwConf-form-row">
        <input
          ref={focusRef}
          placeholder="****"
          className="pwConf-input"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          rows={1}
        />
        <button
          className="submit-button"
          disabled={password === ''}
          onClick={handlePasswordConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
}
