import { useContext } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
import './RoomMenu.css';
import ChangingOwner from './ChangingOwner';
import RoomMenuMembers from './RoomMenuMembers';

export default function RoomMenu({ room, isMenuOpen }) {
  const { user } = useContext(LoginContext);
  const rid = room._id || '';
  const ownerId = room.owner._id;
  const members = room.members || [];
  const info = [
    { label: '오너', value: room.owner.name },
    { label: '개설일', value: room.created },
  ];

  return (
    isMenuOpen && (
      <div className="roomMenu-body">
        <div className="roomMenu-section">
          <div className="roomMenu-section-title">룸 정보</div>

          <ul className="roomMenu-info">
            {info.map((item) => {
              return (
                <li className="each-item" key={item.label}>
                  <div className="roomMenu-info label">{item.label}</div>
                  <div className="roomMenu-info">{item.value}</div>
                </li>
              );
            })}
          </ul>
          {user._id === ownerId && members.length > 1 && (
            <ChangingOwner rid={rid} members={members} />
          )}
        </div>

        <div className="roomMenu-section">
          <div className="roomMenu-section-title">멤버</div>

          <RoomMenuMembers members={members} />
        </div>
      </div>
    )
  );
}
