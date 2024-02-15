import React from 'react';
import useStateLogger from '../../hooks/useStateLogger';
import './RoomMenu.css';
import RoomMenuMembers from './RoomMenuMembers';

export default function RoomMenu(props) {
  const room = props.room;
  const isMenuOpen = props.isMenuOpen;
  // useStateLogger(room, 'room');
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
        </div>

        <div className="roomMenu-section">
          <div className="roomMenu-section-title">멤버</div>

          <RoomMenuMembers members={members} />
        </div>
      </div>
    )
  );
}
