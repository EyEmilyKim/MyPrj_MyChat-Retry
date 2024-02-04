import React from 'react';
import './RoomHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import RoomHeaderIconBack from './RoomHeaderIconBack';
import RoomHeaderIconLeave from './RoomHeaderIconLeave';
import RoomHeaderIconMenu from './RoomHeaderIconMenu';

export default function RoomHeader(props) {
  const room = props.room;
  const toggleMenu = props.toggleMenu;

  return (
    <div className="room-header">
      <div className="section">
        <RoomHeaderIconBack roomTitle={room.title} />
        <div className="room-title">{room.title}</div>
        <RoomHeaderIconLeave rid={room._id} />
      </div>

      <div className="section">
        <FontAwesomeIcon icon={faCrown} className="crown" />
        <p className="owner">{room.owner ? room.owner.name : 'SYSTEM'}</p>
        <RoomHeaderIconMenu toggleMenu={toggleMenu} />
      </div>
    </div>
  );
}
