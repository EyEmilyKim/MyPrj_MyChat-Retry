import React from 'react';
import { alertDeveloping } from '../../utils/alertDeveloping';
import './MySetting.css';
import PasswordReset from './PasswordReset';
import Resign from './Resign';

export default function MySetting() {
  return (
    <div className="mySetting-body">
      <h1 className="mySetting-title">MyApp-test MySetting</h1>

      <div className="mySetting-main">
        <div className="mySetting-feats">
          <PasswordReset />
          <Resign />
          <div className="mySetting-each-feat-title" onClick={alertDeveloping}>
            <p>알림 설정</p>
          </div>
        </div>
      </div>
    </div>
  );
}
