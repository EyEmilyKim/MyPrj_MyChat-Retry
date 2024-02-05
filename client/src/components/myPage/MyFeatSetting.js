import React from 'react';
// CSS definition is in MyPage.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench } from '@fortawesome/free-solid-svg-icons';

export default function MyFeatSetting() {
  return (
    <div className="myPage-each-feat">
      <FontAwesomeIcon icon={faWrench} />
      <p>설정</p>
    </div>
  );
}
