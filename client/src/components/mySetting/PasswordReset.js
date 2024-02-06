import React, { useState } from 'react';
import useToggleState from '../../hooks/useToggleState';
import useStateLogger from '../../hooks/useStateLogger';
import PasswordConfirm from './PasswordConfirm';
import PasswordNew from './PasswordNew';

export default function PasswordReset() {
  const [isSettingOpen, toggleSetting] = useToggleState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  useStateLogger(isConfirmed, 'isConfirmed');

  return (
    <>
      <div className="mySetting-each-feat-title" onClick={toggleSetting}>
        <p>비밀번호 변경</p>
      </div>

      {isSettingOpen ? (
        <div className="mySetting-each-feat-field">
          {!isConfirmed ? <PasswordConfirm /> : <PasswordNew />}
        </div>
      ) : null}
    </>
  );
}
