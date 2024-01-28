import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../contexts/SocketContext';
import axios from 'axios';
import './RoomList.css';

export default function RoomList() {
  const { socket } = useContext(SocketContext);
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    if (socket) {
      setTimeout(() => {
        console.log(`socket : ${socket.id}`);
        socket.emit('getRooms', (res) => {
          // console.log('getRooms res', res);
          setRoomList(res.data);
        });
      }, 60);
    }
  }, []);

  socket.on('rooms', (reason, rooms) => {
    console.log(`on('rooms') ${reason}`, rooms);
    setRoomList(rooms);
  });

  const createDummyRooms = () => {
    axios
      .get('http://localhost:1234/room/createDummy')
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err))
      .finally(() => {
        if (window.confirm('페이지를 새로고침 하시겠습니까?'))
          window.location.reload();
      });
  };

  const clearAllRooms = () => {
    axios
      .get('http://localhost:1234/room/clearRooms')
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
    <>
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

      <div className="roomList-body">
        {roomList.length > 0
          ? roomList.map((room) => (
              <div
                className="each-room"
                key={room._id}
                onClick={() => moveToRoom(room._id)}
              >
                <div className="room-title">{room.title}</div>
                <div className="num-of-member">({room.members.length}명)</div>
              </div>
            ))
          : null}
      </div>
    </>
  );
}
