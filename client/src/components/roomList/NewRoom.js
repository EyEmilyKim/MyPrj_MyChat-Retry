import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../contexts/SocketContext';
import { validation } from '../../utils/beforeWriting';
import './NewRoom.css';

export default function NewRoom() {
  const { socket } = useContext(SocketContext);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    console.log(`handleCreateRoom called ${newTitle}`);
    // 유효성 검사 후
    if (validation(newTitle, 'newTitle')) {
      // 소켓 발신
      socket.emit('createRoom', newTitle, (res) => {
        console.log(`'createRoom' res : `, res);
        if (res && res.status === 'ok') {
          console.log('successfully create', res.data);
          navigate(`/room/${res.data.room._id}`);
        } else if (res && res.status === 'not ok') {
          alert(res.data);
        } else {
          alert(res.status);
        }
      });
    }
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
