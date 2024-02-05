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
          setName(e.target.value);
        }}
      />
      <input
        className="myPage-userDescription-editing"
        placeholder={description}
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
    </div>
  );
}
