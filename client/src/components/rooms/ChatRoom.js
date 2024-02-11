import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContext';
import { SocketContext } from '../../contexts/SocketContext';
import useStateLogger from '../../hooks/useStateLogger';
import useToggleState from '../../hooks/useToggleState';
import useLocalRoomsData from '../../hooks/useLocalRoomsData';
import useScrollToTarget from '../../hooks/useScrollToTarget';
import useHandleScroll from '../../hooks/useHandleScroll';
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
  const [isMenuOpen, toggleMenu] = useToggleState(false);
  useStateLogger(room, 'room');
  // useStateLogger(joinComplete, 'joinComplete');

  const { updateJoinIndex, getJoinIndex } = useLocalRoomsData();
  const [messageList, setMessageList] = useState([]);
  // useStateLogger(messageList, 'messageList');

  const messagesEndRef = useRef();
  const { isUserScrolling, setIsUserScrolling, handleScroll } = useHandleScroll();
  useStateLogger(isUserScrolling, 'isUserScrolling');
  useScrollToTarget(messagesEndRef, [messageList]);
  const detectTarget = document.getElementById('detectTarget');

  useEffect(() => {
    if (messageList.length) {
      console.log('detectTarget', detectTarget);
      if (detectTarget) {
        detectTarget.addEventListener('wheel', () => {
          handleScroll();
        });
        console.log('detectTarget EventListener attached');
      }
    }
  }, [messageList]);

  const getMessages = (joinIndex) => {
    socket.emit('getMessages', rid, joinIndex, (res) => {
      if (res && res.status === 'ok') {
        console.log('successfully getMessages', res);
        if (res.data) setMessageList(res.data);
      } else {
        console.log('failed to getMessages', res);
      }
    });
  };

  useEffect(() => {
    if (joinComplete) {
      const joinIndex = getJoinIndex(rid);
      console.log('local joinIndex', joinIndex);
      getMessages(joinIndex);
    }
  }, [joinComplete]);

  useEffect(() => {
    console.log(`socket : ${socket.id}`);

    socket.emit('joinRoom', rid, (res) => {
      if (res && res.status === 'ok') {
        console.log('successfully joined', res);
        setRoom(res.data.room);
        if (res.data.joinIndex > 0) {
          // 첫 입장 시 joinIndex 로컬에 저장
          updateJoinIndex(rid, res.data.joinIndex);
        }
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
      if (detectTarget) {
        detectTarget.removeEventListener('scroll', () => {
          handleScroll();
        });
      }
    };
  }, []);

  return !joinComplete ? (
    <Loader />
  ) : (
    <div className="room-body">
      <div className="roomHeader-container">
        <RoomHeader room={room} toggleMenu={toggleMenu} />
      </div>

      <div className="room-main">
        {isMenuOpen && (
          <div className="roomMenu-container">
            <RoomMenu room={room} isMenuOpen={isMenuOpen} />
          </div>
        )}
        <div className="chat-container" id="detectTarget">
          {messageList.length > 0 ? (
            <MessageContainer messageList={messageList} user={user} />
          ) : null}
          <div className="endRef" ref={messagesEndRef}></div>
        </div>
      </div>

      <div className="input-container">
        <ChatInput rid={rid} />
      </div>
    </div>
  );
}
