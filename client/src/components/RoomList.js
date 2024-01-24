import { useContext, useEffect } from 'react';
import { SocketContext } from '../contexts/SocketContext';
import axios from 'axios';

export default function RoomList() {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      setTimeout(() => {
        console.log(`socket : ${socket.id}`);
      }, 60);
      socket.emit('getRooms', (res) => {
        console.log('page getRooms res', res);
      });
    }
  }, []);

  const getRooms = () => {
    socket.emit('getRooms', (res) => {
      console.log('button getRooms res', res);
    });
  };
  const createDummyRooms = () => {
    axios
      .get('http://localhost:1234/room/createDummy')
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="userList-header">
        <h1 className="userList-title">MyApp-test RoomList</h1>

        <button onClick={getRooms}>get Rooms</button>
        <br />
        <button onClick={createDummyRooms}>dummy Rooms</button>
      </div>
    </>
  );
}
