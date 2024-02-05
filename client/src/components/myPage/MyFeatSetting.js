import React from 'react';
import { useNavigate } from 'react-router-dom';
// CSS definition is in MyPage.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench } from '@fortawesome/free-solid-svg-icons';

export default function MyFeatSetting() {
  const navigate = useNavigate();
  const moveToSetting = () => {
    // console.log('moveToSetting called');
    navigate('/mySetting');
  };

  return (
    <div className="myPage-each-feat" onClick={moveToSetting}>
      <FontAwesomeIcon icon={faWrench} />
      <p>설정</p>
    </div>
  );
}
