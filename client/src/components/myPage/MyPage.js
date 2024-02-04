import React, { useContext } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
import './MyPage.css';

export default function MyPage() {
  const { user } = useContext(LoginContext);

  return (
    <div className="myPage-body">
      <h1 className="myPage-title">MyApp-test MyPage</h1>

      <div className="myPage-main">
        <div className="myPage-profile">
          <img
            src="/profile.jpeg"
            alt="user-profile-image"
            className="myPage-userImage"
          />
          <p className="myPage-userName">{user.name} </p>
          <p className="myPage-userDescription">{user.description}</p>
          <p className="myPage-userCreated">Since {user.created} </p>
        </div>

        <div className="myPage-feats">
          <div className="myPage-modify">수정</div>
          <div className="myPage-setting">설정</div>
        </div>
      </div>
    </div>
  );
}
