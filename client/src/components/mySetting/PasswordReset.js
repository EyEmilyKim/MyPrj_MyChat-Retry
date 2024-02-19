import React, { useRef, useState } from 'react';
import useToggleState from '../../hooks/useToggleState';
import useOutsideClick from '../../hooks/useOutsideClick';
import useStateLogger from '../../hooks/useStateLogger';
import PasswordConfirm from './PasswordConfirm';
import PasswordNew from './PasswordNew';

export default function PasswordReset() {
  const [isSettingOpen, toggleSetting, setSetting] = useToggleState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  // useStateLogger(isConfirmed, 'isConfirmed');

  const clickRef = useRef();
  useOutsideClick(clickRef, () => {
    setSetting(false);
  });

  return (
    <div ref={clickRef}>
      <div className="mySetting-each-feat-title" onClick={toggleSetting}>
        <p>비밀번호 변경</p>
      </div>

      {isSettingOpen ? (
        <div className="mySetting-each-feat-field">
          {!isConfirmed ? (
            <PasswordConfirm setIsConfirmed={setIsConfirmed} />
          ) : (
            <PasswordNew toggleSetting={toggleSetting} setIsConfirmed={setIsConfirmed} />
          )}
        </div>
      ) : null}
    </div>
  );
}
