import React from 'react';
// CSS definition is in MyPage.css
import MyProfileEditing from './MyProfileEditing';
import MyFeatSave from './MyFeatSave';
import MyFeatCancel from './MyFeatCancel';

export default function MyMainEditing(props) {
  const toggleEditing = props.toggleEditing;

  return (
    <>
      <MyProfileEditing />

      <div className="myPage-feats">
        <MyFeatSave toggleEditing={toggleEditing} />
        <MyFeatCancel toggleEditing={toggleEditing} />
      </div>
    </>
  );
}
