import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../contexts/SocketContext';

export default function RoomHeaderIconLeave(props) {
  const rid = props.rid;
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  const handleLeaveRoom = () => {
    console.log(`leaveRoom called`);
    if (!window.confirm(`이 방을 완전히 떠나시겠습니까?`)) return;
    socket.emit('leaveRoom', rid, (res) => {
      if (res && res.status === 'ok') {
        navigate(`/roomList`);
        console.log('successfully left', res);
      } else {
        console.log('failed to leave', res);
      }
    });
  };

  return (
    <FontAwesomeIcon
      icon={faArrowRightFromBracket}
      className="header-button leave"
      onClick={handleLeaveRoom}
    />
  );
}
