import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../contexts/SocketContext';
import { createDummyRooms } from '../../utils/createDummyRooms';
import { clearAllRooms } from '../../utils/clearAllRooms';
import useClassifyRooms from '../../hooks/useClassifyRooms';
import useHandleScroll from '../../hooks/useHandleScroll';
import useScrollToBottomInDelay from '../../hooks/useScrollToBottomInDelay';
import useStateLogger from '../../hooks/useStateLogger';
import './RoomList.css';
import NonClassifiedRooms from './NonClassifiedRooms';
import ClassifiedRooms from './ClassifiedRooms';
import NewRoom from './NewRoom';

export default function RoomList() {
  const { socket } = useContext(SocketContext);
  const [roomList, setRoomList] = useState([]);
  const { joinedRooms, notMyRooms, classifyRooms } = useClassifyRooms();

  useEffect(() => {
    classifyRooms(roomList);
  }, [roomList]);

  const scrollRef = useRef();
  const { isUserScrolling, handleScroll, setIsUserScrolling } = useHandleScroll();
  useStateLogger(isUserScrolling, 'isUserScrolling');
  // useScrollToBottomInDelay(scrollRef, 10, [roomList], isUserScrolling);

  useEffect(() => {
    console.log(`socket : ${socket.id}`);

    socket.emit('getRooms', (res) => {
      console.log('getRooms res', res);
      setRoomList(res.data);
    });

    socket.on('rooms', (reason, rooms) => {
      console.log(`on('rooms') ${reason}`, rooms);
      setRoomList(rooms);
    });

    const targetDiv = document.getElementById('scrollTarget');
    if (targetDiv) {
      console.log('targetDiv', targetDiv);
      targetDiv.addEventListener('scroll', () => {
        handleScroll();
      });
    }

    // 컴포넌트 언마운트 시 이벤트 해제
    return () => {
      socket.off('rooms');
      if (targetDiv) {
        targetDiv.removeEventListener('scroll', () => {
          handleScroll();
        });
      }
    };
  }, []);

  const navigate = useNavigate();
  const moveToRoom = (rid) => {
    navigate(`/room/${rid}`);
  };

  return (
    <div className="roomList-body">
      <div className="roomList-header">
        <h1 className="roomList-title">MyApp-test RoomList</h1>
        <div className="button-area">
          <button className="dummy-rooms" onClick={createDummyRooms}>
            dummy Rooms
          </button>
          <button className="clear-rooms" onClick={clearAllRooms}>
            clear Rooms
          </button>
          <button
            className=""
            onClick={() => {
              setIsUserScrolling(false);
            }}
          >
            UserScrolling false
          </button>
        </div>
      </div>

      <div className="roomList-container" id="scrollTarget" ref={scrollRef}>
        {/* <NonClassifiedRooms roomList={roomList} moveToRoom={moveToRoom} /> */}
        <ClassifiedRooms
          joinedRooms={joinedRooms}
          notMyRooms={notMyRooms}
          moveToRoom={moveToRoom}
        />
      </div>

      <div className="newRoom-container">
        <NewRoom />
      </div>
    </div>
  );
}
