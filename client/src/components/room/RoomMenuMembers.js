// CSS definition is in 'RoomMenu.css'

export default function RoomMenuMembers({ members = [] }) {
  return (
    <ul className="roomMenu-members">
      {members.map((item) => {
        return (
          <li className="each-item" key={item._id}>
            <img src="/profile.jpeg" alt="user_profile_image" className="profile-image" />
            <div className="roomMenu-member-name">{item.name}</div>
          </li>
        );
      })}
    </ul>
  );
}
