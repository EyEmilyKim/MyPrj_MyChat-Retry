import React from 'react';
import './NoPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function NoPage() {
  return (
    <div className="noPage-body">
      <FontAwesomeIcon icon={faTriangleExclamation} size="4x" />
      <p>페이지를 찾을 수 없습니다</p>
    </div>
  );
}
