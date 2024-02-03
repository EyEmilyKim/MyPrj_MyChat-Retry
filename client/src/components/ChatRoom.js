import { useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { SocketContext } from '../contexts/SocketContext';
import useStateLogger from '../hooks/useStateLogger';
import useToggleMenu from '../hooks/useToggleMenu';
import './ChatRoom.css';
import Loader from '../util-components/Loader';
import RoomHeader from './RoomHeader';
import RoomMenu from './RoomMenu';
import MessageContainer from './MessageContainer';
import ChatInput from './ChatInput';

export default function ChatRoom() {
  const { rid } = useParams();
  const { user } = useContext(LoginContext);
  const { socket } = useContext(SocketContext);
  const [room, setRoom] = useState('fetching room data...');
  const [isFetching, setIsFetching] = useState(true);
  const { isMenuOpen, toggleMenu } = useToggleMenu(true);
  useStateLogger(room, 'room');
  // useStateLogger(isFetching, 'isFetching');

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

  const scrollRef = useRef();
  useEffect(() => {
    console.log('[messageList]', messageList);
    if (!isFetching)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messageList]);

  useEffect(() => {
    console.log(`socket : ${socket.id}`);

    socket.emit('joinRoom', rid, (res) => {
      if (res && res.status === 'ok') {
        console.log('successfully joined', res);
        setRoom(res.data.room);
        setIsFetching(false);
      } else {
        console.log('failed to join', res);
      }
    });

    socket.on('message', (message) => {
      // console.log(`on('message') : ${JSON.stringify(message)}`);
      setMessageList((prevState) => [...prevState, message]);
    });

    socket.on('updatedRoom', (room) => {
      console.log(`on('updatedRoom'): `, room);
      setRoom(room);
    });

    // 컴포넌트 언마운트 시 이벤트 해제
    return () => {
      const eventsToOff = ['message', 'updatedRoom'];
      eventsToOff.map((item) => {
        socket.off(item);
      });
    };
  }, []);

  return isFetching ? (
    <Loader />
  ) : (
    <div className="room-body">
      <div className="roomHeader-container">
        <RoomHeader room={room} toggleMenu={toggleMenu} />
      </div>

      <div className="room-main" ref={scrollRef}>
        {isMenuOpen && (
          <div className="roomMenu-container">
            <RoomMenu room={room} isMenuOpen={isMenuOpen} />
          </div>
        )}
        <div className="chat-container">
          {messageList.length > 0 ? (
            <MessageContainer messageList={messageList} user={user} />
          ) : null}
        </div>
      </div>

      <div className="input-container">
        <ChatInput rid={rid} />
      </div>
    </div>
  );
}
