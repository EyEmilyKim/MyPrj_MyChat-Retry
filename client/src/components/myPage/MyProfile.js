import React, { useContext } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
// CSS definition is in MyPage.css

export default function MyProfile() {
  const { user } = useContext(LoginContext);

  return (
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
  );
}
