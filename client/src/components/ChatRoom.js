import { useParams } from 'react-router-dom';
import './ChatRoom.css';
import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { SocketContext } from '../contexts/SocketContext';

export default function ChatRoom() {
  const { id } = useParams();
  const { user } = useContext(LoginContext);
  const { socket } = useContext(SocketContext);
  const [roomTitle, setRoomTitle] = useState('fetching room title...');

  useEffect(() => {
    socket.emit('joinRoom', id, (res) => {
      if (res && res.status === 'ok') {
        console.log('successfully joined', res);
        setRoomTitle(res.data.room.title);
      } else {
        console.log('failed to join', res);
      }
    });
    socket.on('welcomeMessage', (welcomeMessage, cb) => {
      console.log(`on('welcomeMessage') : ${welcomeMessage}`);
      cb('welcomeMessage, got it');
    });
  }, []);

  return (
    <>
      <div className="room-header">
        <h1 className="room-title">{roomTitle}</h1>
        <p>welcome ${user.name}~~</p>
      </div>
    </>
  );
}
