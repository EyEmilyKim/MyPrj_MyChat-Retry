import { useEffect, useRef, useState } from 'react';
import useToggleState from '../../hooks/useToggleState';
import useOutsideClick from '../../hooks/useOutsideClick';
import PasswordConfirm from './PasswordConfirm';
import useResign from '../../hooks/useResign';

export default function Resign() {
  const [isSettingOpen, toggleSetting, setSetting] = useToggleState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { handleResign } = useResign();

  useEffect(() => {
    if (isConfirmed) {
      handleResign();
      setIsConfirmed(false);
      toggleSetting();
    }
  }, [isConfirmed]);

  const clickRef = useRef();
  useOutsideClick(clickRef, () => {
    setSetting(false);
  });

  return (
    <div ref={clickRef}>
      <div className="mySetting-each-feat-title" onClick={toggleSetting}>
        <p>계정 삭제</p>
      </div>

      {isSettingOpen ? (
        <div className="mySetting-each-feat-field">
          {!isConfirmed ? <PasswordConfirm setIsConfirmed={setIsConfirmed} /> : null}
        </div>
      ) : null}
    </div>
  );
}
