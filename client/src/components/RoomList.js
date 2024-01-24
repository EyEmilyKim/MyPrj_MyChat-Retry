import { useContext, useEffect, useState } from 'react';
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
      }, 60);
      socket.emit('getRooms', (res) => {
        console.log('page getRooms res', res);
        setRoomList(res.rooms);
      });
    }
  }, []);

  const createDummyRooms = () => {
    axios
      .get('http://localhost:1234/room/createDummy')
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="roomList-header">
        <h1 className="roomList-title">MyApp-test RoomList</h1>
        <div className="button-area">
          <button> X </button>
          <button onClick={createDummyRooms}>dummy Rooms</button>
        </div>
      </div>

      <div className="roomList-body">
        {roomList.length > 0
          ? roomList.map((room) => (
              <div className="each-room" key={room._id}>
                <div className="room-title">{room.title}</div>
              </div>
            ))
          : null}
      </div>
    </>
  );
}
