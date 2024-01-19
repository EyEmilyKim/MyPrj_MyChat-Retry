import { useContext, useEffect, useState } from 'react';
import './UserList.css';
import { SocketContext } from '../contexts/SocketContext';

export default function UserList() {
  const { socket } = useContext(SocketContext);
  const [userList, setUserList] = useState([]);
  console.log('userList', userList);

  useEffect(() => {
    if (socket) {
      const handleUsers = (users) => {
        console.log('handleUsers called');
        setUserList(users);
      };

      if (socket) {
        socket.on('users', handleUsers);
        socket.emit('getUsers');
      }

      return () => {
        socket.off('users', handleUsers);
      };
    }
  }, [socket]);

  return (
    <>
      <div className="userList-body">
        <h1 className="userList-title">MyApp-test UserList</h1>
      </div>

      {userList.length > 0
        ? userList.map((user) => (
            <div className="user-list" key={user.id}>
              <div className="user-name">{user.name}</div>
              <div
                className={`user-online ${user.online ? 'online' : 'offline'}`}
              >
                {user.online ? '●' : '●'}
              </div>
              {/* <div className="user-online">{user.online}</div> */}
            </div>
          ))
        : null}
    </>
  );
}
