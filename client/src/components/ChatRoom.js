import { useNavigate, useParams } from 'react-router-dom';
import './ChatRoom.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { SocketContext } from '../contexts/SocketContext';
import MessageContainer from './MessageContainer';
import ChatInput from './ChatInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import Loader from '../util-components/Loader';
import RoomMenu from './RoomMenu';
import useStateLogger from '../hooks/useStateLogger';
import useToggleMenu from '../hooks/useToggleMenu';

export default function ChatRoom() {
  const { rid } = useParams();
  const { user } = useContext(LoginContext);
  const { socket } = useContext(SocketContext);
  const [room, setRoom] = useState('fetching room data...');
  const [isFetching, setIsFetching] = useState(true);
  useStateLogger(room, 'room');
  // useStateLogger(isFetching, 'isFetching');
  const { isMenuOpen, toggleMenu } = useToggleMenu(true);

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

  const navigate = useNavigate();
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

  const handleBack = () => {
    console.log(`handleBack called`);
    navigate(`/roomList`);
    console.log(`successfully back from "${room.title}"`);
  };

  return isFetching ? (
    <Loader />
  ) : (
    <div className="room-container">
      <div className="room-header">
        <div className="section">
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="header-button back"
            onClick={handleBack}
          />
          <div className="room-title">{room.title}</div>
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            className="header-button leave"
            onClick={handleLeaveRoom}
          />
        </div>

        <div className="section">
          <FontAwesomeIcon icon={faCrown} className="crown" />
          <p className="owner">{room.owner ? room.owner.name : 'SYSTEM'}</p>
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="header-button menu"
            onClick={toggleMenu}
          />
        </div>
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
