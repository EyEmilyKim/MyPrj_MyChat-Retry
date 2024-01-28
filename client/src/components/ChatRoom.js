import { useParams } from 'react-router-dom';
import './ChatRoom.css';
import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { SocketContext } from '../contexts/SocketContext';
import MessageContainer from './MessageContainer';
import ChatInput from './ChatInput';

export default function ChatRoom() {
  const { rid } = useParams();
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
    socket.emit('joinRoom', rid, (res) => {
      if (res && res.status === 'ok') {
        console.log('successfully joined', res);
        setRoomTitle(res.data.room.title);
      } else {
        console.log('failed to join', res);
      }
    });
  }, []);

  socket.on('welcomeMessage', (welcomeMessage) => {
    console.log(`on('welcomeMessage') : ${JSON.stringify(welcomeMessage)}`);
  });
  // socket.on('message', (res, cb) => {
  //   console.log('received message', res);
  //   setMessageList((prevState) => prevState.concat(res));
  //   cb('message, got it');
  // });

  return (
    <div className="room-container">
      <div className="room-header">
        <div className="room-title">{roomTitle}</div>
        <p className="user">{user.name}</p>
      </div>

      <div className="chat-container">
        {messageList.length > 0 ? (
          <MessageContainer messageList={messageList} user={user} />
        ) : null}
      </div>

      <div className="input-container">
        <ChatInput></ChatInput>
      </div>
    </div>
  );
}
