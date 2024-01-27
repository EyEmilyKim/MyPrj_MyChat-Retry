import { useParams } from 'react-router-dom';
import './ChatRoom.css';
import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { SocketContext } from '../contexts/SocketContext';
import MessageContainer from './MessageContainer';

export default function ChatRoom() {
  const { id } = useParams();
  const { user } = useContext(LoginContext);
  const { socket } = useContext(SocketContext);
  const [roomTitle, setRoomTitle] = useState('fetching room title...');
  const [messageList, setMessageList] = useState([
    {
      _id: 'dummy1',
      user: { name: 'system' },
      content: `dummy System message`,
    },
    {
      _id: 'dummy2',
      user: { name: 'Alfa' },
      content: `Hi there, I'm Alfa. this is dummy`,
    },
    {
      _id: 'dummy3',
      user: { name: 'Chalie' },
      content: `Hi Alfa, I'm Chalie. this is dummy too`,
    },
  ]);

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
        <p className="user">{user.name}</p>
      </div>

      <div className="chat-container">
        {messageList.length > 0 ? (
          <MessageContainer messageList={messageList} user={user} />
        ) : null}
      </div>
    </>
  );
}
