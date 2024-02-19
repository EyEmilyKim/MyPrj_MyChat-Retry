import { useEffect, useRef, useState } from 'react';
import usePasswordNew from '../../hooks/usePasswordNew';
import './PasswordNew.css';

export default function PasswordNew(props) {
  const toggleSetting = props.toggleSetting;
  const setIsConfirmed = props.setIsConfirmed;
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const focusRef = useRef();
  useEffect(() => {
    focusRef.current.focus();
  }, []);

  const argsForHook = {
    password1,
    toggleSetting,
    setIsConfirmed,
  };
  const { handlePasswordNew } = usePasswordNew(argsForHook);

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
        disabled={password1 === '' || password2 === '' || password1 !== password2}
        onClick={handlePasswordNew}
      >
        확인
      </button>
    </div>
  );
}
