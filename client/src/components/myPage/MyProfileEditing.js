// CSS definition is in MyPage.css

export default function MyProfileEditing(props) {
  const name = props.name;
  const setName = props.setName;
  const description = props.description;
  const setDescription = props.setDescription;

  return (
    <div className="myPage-profile">
      <img
        src="/profile.jpeg"
        alt="user-profile-image"
        className="myPage-userImage"
      />
      <input
        className="myPage-userName-editing"
        placeholder={name}
        value={name}
        onChange={(e) => {
          if (e.target.value.length > 15) {
            alert('닉네임은 15자를 넘을 수 없어요');
            return;
          }
          setName(e.target.value);
        }}
      />
      <input
        className="myPage-userDescription-editing"
        placeholder={description}
        value={description}
        onChange={(e) => {
          if (e.target.value.length > 40) {
            alert('메세지는 40자를 넘을 수 없어요');
            return;
          }
          setDescription(e.target.value);
        }}
      />
    </div>
  );
}
