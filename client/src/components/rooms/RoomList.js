import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../contexts/SocketContext';
import { createDummyRooms } from '../../utils/createDummyRooms';
import { clearAllRooms } from '../../utils/clearAllRooms';
import useClassifyRooms from '../../hooks/useClassifyRooms';
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

    // 컴포넌트 언마운트 시 이벤트 해제
    return () => {
      socket.off('rooms');
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
        </div>
      </div>

      <div className="roomList-container">
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
