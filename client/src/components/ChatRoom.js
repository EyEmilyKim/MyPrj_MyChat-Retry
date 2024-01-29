import { useParams } from 'react-router-dom';
import './ChatRoom.css';
import { useContext, useEffect, useRef, useState } from 'react';
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
      sender: { name: 'system' },
      content: `dummy System message`,
      timestamp: new Date(),
    },
    {
      _id: 'dummy2',
      sender: { name: 'Alfa', email: 'alfa@a.com' },
      content: `Hi there, I'm Alfa. this is dummy`,
      timestamp: new Date(),
    },
    {
      _id: 'dummy3',
      sender: { name: 'Chalie', email: 'chalie@c.com' },
      content: `Hi Alfa, I'm Chalie. this is dummy too`,
      timestamp: new Date(),
    },
  ]);
  const messageContainerRef = useRef();
  useEffect(() => {
    console.log('[messageList]', messageList);
    messageContainerRef.current.scrollTop =
      messageContainerRef.current.scrollHeight;
  }, [messageList]);

  useEffect(() => {
    socket.emit('joinRoom', rid, (res) => {
      if (res && res.status === 'ok') {
        console.log('successfully joined', res);
        setRoomTitle(res.data.room.title);
      } else {
        console.log('failed to join', res);
      }
    });

    socket.on('message', (message) => {
      // console.log(`on('message') : ${JSON.stringify(message)}`);
      setMessageList((prevState) => [...prevState, message]);
    });
  }, []);

  return (
    <div className="room-container">
      <div className="room-header">
        <div className="room-title">{roomTitle}</div>
        <p className="user">{user.name}</p>
      </div>

      <div className="chat-container" ref={messageContainerRef}>
        {messageList.length > 0 ? (
          <MessageContainer messageList={messageList} user={user} />
        ) : null}
      </div>

      <div className="input-container">
        <ChatInput rid={rid} />
      </div>
    </div>
  );
}
