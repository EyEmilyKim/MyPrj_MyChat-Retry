import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContext';
import { SocketContext } from '../../contexts/SocketContext';
import useStateLogger from '../../hooks/useStateLogger';
import useToggleState from '../../hooks/useToggleState';
import './ChatRoom.css';
import Loader from '../../components-util/Loader';
import RoomHeader from './RoomHeader';
import RoomMenu from './RoomMenu';
import MessageContainer from './MessageContainer';
import ChatInput from './ChatInput';

export default function ChatRoom() {
  const { rid } = useParams();
  const { user } = useContext(LoginContext);
  const { socket } = useContext(SocketContext);
  const [room, setRoom] = useState('fetching room data...');
  const [joinComplete, setJoinComplete] = useState(false);
  const [isMenuOpen, toggleMenu] = useToggleState(true);
  useStateLogger(room, 'room');
  // useStateLogger(isFetching, 'isFetching');

  const [messageList, setMessageList] = useState([]);

  const scrollRef = useRef();
  useEffect(() => {
    console.log('[messageList]', messageList);
    if (joinComplete) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messageList]);

  const getMessages = () => {
    socket.emit('getMessages', rid, (res) => {
      if (res && res.status === 'ok') {
        console.log('successfully getMessages', res);
        if (res.data) setMessageList(res.data);
      } else {
        console.log('failed to getMessages', res);
      }
    });
  };

  useEffect(() => {
    if (joinComplete) getMessages();
  }, [joinComplete]);

  useEffect(() => {
    console.log(`socket : ${socket.id}`);

    socket.emit('joinRoom', rid, (res) => {
      if (res && res.status === 'ok') {
        console.log('successfully joined', res);
        setRoom(res.data.room);
        setJoinComplete(true);
      } else {
        console.log('failed to join', res);
      }
    });

    socket.on('updatedRoom', (room) => {
      console.log(`on('updatedRoom'): `, room);
      setRoom(room);
      getMessages();
    });

    socket.on('message', (message) => {
      // console.log(`on('message') : ${JSON.stringify(message)}`);
      setMessageList((prevState) => [...prevState, message]);
    });

    // 컴포넌트 언마운트 시 이벤트 해제
    return () => {
      const eventsToOff = ['message', 'updatedRoom'];
      eventsToOff.map((item) => {
        socket.off(item);
      });
    };
  }, []);

  return !joinComplete ? (
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
