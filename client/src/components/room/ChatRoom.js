import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLoginContext } from '../../contexts/LoginContext';
import { useSocketContext } from '../../contexts/SocketContext';
import { useDataContext } from '../../contexts/DataContext';
import useGroupingMessages from '../../hooks/useGroupingMessages';
import useStateLogger from '../../hooks/useStateLogger';
import useToggleState from '../../hooks/useToggleState';
import useScrollPosition from '../../hooks/useScrollPosition';
import useLastReadIndex from '../../hooks/useLastReadIndex';
import useScrollToTarget from '../../hooks/useScrollToTarget';
import './ChatRoom.css';
import Loader from '../../components-util/Loader';
import RoomHeader from './RoomHeader';
import RoomMenu from './RoomMenu';
import MessageContainer from './MessageContainer';
import ChatRoomIconDown from './ChatRoomIconDown';
import ChatInput from './ChatInput';

export default function ChatRoom() {
  const { rid } = useParams();
  const { user } = useLoginContext();
  const { socket } = useSocketContext();
  const [room, setRoom] = useState('fetching room data...');
  const [joinComplete, setJoinComplete] = useState(false);
  const [isMenuOpen, toggleMenu] = useToggleState(false);
  // useStateLogger(room, 'room');
  // useStateLogger(joinComplete, 'joinComplete');

  const [joinIndex, setJoinIndex] = useState(-1);
  const [messageList, setMessageList] = useState([]);
  // useStateLogger(messageList, 'messageList');
  const { groupedMessages } = useGroupingMessages(messageList);
  // useStateLogger(groupedMessages, 'groupedMessageList');

  const scrollRef = useRef();
  const { isOnBottom } = useScrollPosition(scrollRef, false);
  const { lastReadIndex } = useLastReadIndex(scrollRef, groupedMessages, isOnBottom);
  // useStateLogger(isOnBottom, 'isOnBottom');
  // useStateLogger(lastReadIndex, 'lastReadIndex');

  const bottomRef = useRef();
  const { handleScrollToTarget } = useScrollToTarget(bottomRef, [groupedMessages], isOnBottom);

  const { resetNotificationCount, applyNotificationCount } = useDataContext();

  useEffect(() => {
    if (joinIndex > 0) {
      // console.log('joinIndex', joinIndex);
      socket.emit('getMessages', rid, joinIndex, (res) => {
        if (res && res.status === 'ok') {
          console.log(`successfully getMessages since ${joinIndex}`, res);
          if (res.data) setMessageList(res.data);
        } else {
          console.log('failed to getMessages', res);
        }
      });
    }
  }, [joinIndex, room]);

  useEffect(() => {
    if (lastReadIndex > 0) {
      socket.emit('sendLastReadIndex', rid, lastReadIndex, (res) => {
        if (res && res.status === 'ok') {
          // console.log(`successfully sendLastReadIndex as ${lastReadIndex}`, res);
        } else {
          console.log('failed to sendLastReadIndex', res);
        }
      });
    }
  }, [lastReadIndex]);

  useEffect(() => {
    console.log(`socket : ${socket.id}`);

    socket.emit('joinRoom', rid, (res) => {
      if (res && res.status === 'ok') {
        console.log('successfully joined', res);
        setRoom(res.data.room);
        setJoinIndex(res.data.roomIndex.joinIndex);
        setJoinComplete(true);
      } else {
        console.log('failed to join', res);
      }
    });

    socket.on('updatedRoom', (room) => {
      console.log(`on('updatedRoom'): `, room);
      setRoom(room);
    });

    socket.on(`message-${rid}`, (message) => {
      // console.log(`on('message') : ${JSON.stringify(message)}`);
      setMessageList((prevState) => [...prevState, message]);
      resetNotificationCount(rid);
    });

    // 컴포넌트 언마운트 시 이벤트 해제
    return () => {
      const eventsToOff = [`message-${rid}`, 'updatedRoom'];
      eventsToOff.map((item) => {
        socket.off(item);
      });

      applyNotificationCount(rid);
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
        <div className="chat-container" ref={scrollRef}>
          {messageList.length > 0 ? <MessageContainer groupedMessages={groupedMessages} /> : null}
          <div className="bottomRef" ref={bottomRef} />
        </div>
      </div>

      {!isOnBottom ? (
        <div
          className="room-icon-down"
          onClick={() => {
            handleScrollToTarget();
          }}
        >
          <ChatRoomIconDown />
        </div>
      ) : null}

      <div className="input-container">
        <ChatInput rid={rid} />
      </div>
    </div>
  );
}
