import React, { useContext } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
// CSS definition is in MyPage.css

export default function MyProfileNormal() {
  const { user } = useContext(LoginContext);
  const userCreated = user.created;
  const userCreatedFormatted = userCreated.substring(0, 10);

  return (
    <div className="myPage-profile">
      <img
        src="/profile.jpeg"
        alt="user-profile-image"
        className="myPage-userImage"
      />
      <p className="myPage-userName">{user.name} </p>
      <p className="myPage-userDescription">{user.description}</p>
      <div className="myPage-default">
        <p>가입일 {userCreatedFormatted}</p>
        <p>{user.email} </p>
      </div>
    </div>
  );
}
