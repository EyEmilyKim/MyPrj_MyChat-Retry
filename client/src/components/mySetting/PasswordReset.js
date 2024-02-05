import React, { useState } from 'react';
import useToggleState from '../../hooks/useToggleState';
import useStateLogger from '../../hooks/useStateLogger';
import PasswordAuth from './PasswordAuth';
import PasswordNew from './PasswordNew';

export default function PasswordReset() {
  const [isSettingOpen, toggleSetting] = useToggleState(true);
  const [authComplete, setAuthComplete] = useState(false);
  useStateLogger(authComplete, 'authComplete');

  return (
    <>
      <div className="mySetting-each-feat" onClick={toggleSetting}>
        <p>비밀번호 변경</p>
      </div>

      {isSettingOpen ? (
        !authComplete ? (
          <PasswordAuth />
        ) : (
          <PasswordNew />
        )
      ) : null}
    </>
  );
}
