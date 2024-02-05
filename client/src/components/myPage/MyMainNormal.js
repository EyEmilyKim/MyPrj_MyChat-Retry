import React from 'react';
// CSS definition is in MyPage.css
import MyProfileNormal from './MyProfileNormal';
import MyFeatEdit from './MyFeatEdit';
import MyFeatSetting from './MyFeatSetting';

export default function MyMainNormal(props) {
  const toggleEditing = props.toggleEditing;

  return (
    <>
      <MyProfileNormal />

      <div className="myPage-feats">
        <MyFeatEdit toggleEditing={toggleEditing} />
        <MyFeatSetting />
      </div>
    </>
  );
}
