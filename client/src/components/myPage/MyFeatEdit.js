import React from 'react';
// CSS definition is in MyPage.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function MyFeatEdit() {
  return (
    <div className="myPage-each-feat">
      <FontAwesomeIcon icon={faPen} />
      <p>수정</p>
    </div>
  );
}
