import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContext';
import { SocketContext } from '../../contexts/SocketContext';
import axios from 'axios';
import ClassifiedRooms from './ClassifiedRooms';
import './RoomList.css';
import NewRoom from './NewRoom';

export default function RoomList() {
  const { user } = useContext(LoginContext);
  const { socket } = useContext(SocketContext);
  const [roomList, setRoomList] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [notMyRooms, setNotMyRooms] = useState([]);
  const apiRoot = process.env.REACT_APP_API_ROOT;

  useEffect(() => {
    console.log(`socket : ${socket.id}`);

    socket.emit('getRooms', (res) => {
      console.log('getRooms res', res);
      setRoomList(res.data);
      classifyRooms(res.data);
    });

    socket.on('rooms', (reason, rooms) => {
      console.log(`on('rooms') ${reason}`, rooms);
      setRoomList(rooms);
      classifyRooms(rooms);
    });

    // 컴포넌트 언마운트 시 이벤트 해제
    return () => {
      socket.off('rooms');
    };
  }, []);

  const classifyRooms = async (roomList) => {
    let joinedRooms = [];
    let notMyRooms = [];
    await roomList.map((room) => {
      if (room.members.some((memberId) => memberId === user._id)) {
        joinedRooms.push(room);
      } else {
        notMyRooms.push(room);
      }
    });
    // console.log(`classifyRooms joinedRooms : `, joinedRooms);
    // console.log(`classifyRooms notMyRooms : `, notMyRooms);
    setJoinedRooms(joinedRooms);
    setNotMyRooms(notMyRooms);
  };

  const createDummyRooms = () => {
    axios
      .get(`${apiRoot}/room/createDummy`)
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err))
      .finally(() => {
        if (window.confirm('페이지를 새로고침 하시겠습니까?'))
          window.location.reload();
      });
  };

  const clearAllRooms = () => {
    axios
      .get(`${apiRoot}/room/clearRooms`)
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err))
      .finally(() => {
        if (window.confirm('페이지를 새로고침 하시겠습니까?'))
          window.location.reload();
      });
  };

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
        {/* nonClassified-format 비표시 ↓ */}
        <div className="nonClassified-format">
          <div className="format-title">전체 RoomList</div>
          {roomList.length > 0
            ? roomList.map((room) => (
                <div
                  className="each-room"
                  key={room._id}
                  onClick={() => moveToRoom(room._id)}
                >
                  <div className="room-title">{room.title}</div>
                  <div className="member-count">({room.members.length}명)</div>
                </div>
              ))
            : null}
        </div>
        {/* nonClassified-format 비표시 ↑ */}
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
