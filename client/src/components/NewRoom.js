import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewRoom.css';
import { SocketContext } from '../contexts/SocketContext';
const { validateText, escapeHTML } = require('../utils/beforeWriting');

export default function NewRoom() {
  const { socket } = useContext(SocketContext);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    console.log(`handleCreateRoom called ${newTitle}`);
    // 타이틀 유효성 검사
    const validation = validateText(newTitle);
    // console.log('validation', validation);
    if (!validation.result) {
      console.log(`Invalid title :\n${validation.invalidReason.join('\n')}`);
      alert(`Invalid title :\n${validation.invalidReason.join('\n')}`);
      return;
    }
    // HTML escape 처리
    const escapedTitle = escapeHTML(newTitle);
    // console.log(`modified title : ${escapedTitle}`);
    // 소켓 발신
    socket.emit('createRoom', escapedTitle, (res) => {
      console.log(`'createRoom' res : `, res);
      if (res && res.status === 'ok') {
        console.log('successfully create', res.data);
        navigate(`/room/${res.data.room._id}`);
      } else {
        alert(res.data);
      }
    });
    setNewTitle('');
  };

  return (
    <div className="newRoom-body">
      <input
        type="text"
        className="newRoom-input"
        placeholder="새로운 방 제목.."
        value={newTitle}
        onChange={(e) => {
          setNewTitle(e.target.value);
        }}
        rows={1}
      />
      <button
        className="create-button"
        disabled={newTitle === ''}
        onClick={handleCreateRoom}
      >
        만들기
      </button>
    </div>
  );
}
