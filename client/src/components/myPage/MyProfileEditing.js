import React, { useContext, useState } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
// CSS definition is in MyPage.css

export default function MyProfileEditing() {
  const { user } = useContext(LoginContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="myPage-profile">
      <img
        src="/profile.jpeg"
        alt="user-profile-image"
        className="myPage-userImage"
      />
      <input
        className="myPage-userName-editing"
        placeholder={user.name}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        className="myPage-userDescription-editing"
        placeholder={user.description}
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      {/* <p className="myPage-userCreated"></p> */}
    </div>
  );
}
