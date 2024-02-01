import { useContext, useEffect, useState } from 'react';
import './UserList.css';
import { SocketContext } from '../contexts/SocketContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import useStateLogger from '../hooks/useStateLogger';

export default function UserList() {
  const { socket } = useContext(SocketContext);
  const [userList, setUserList] = useState([]);
  useStateLogger(userList, 'useList');

  useEffect(() => {
    console.log(`socket : ${socket.id}`);

    socket.emit('getUsers', (res) => {
      // console.log('getUsers res', res);
      setUserList(res.data);
    });

    socket.on('users', (reason, users) => {
      console.log(`on('users') ${reason}`, users);
      setUserList(users);
    });

    // 컴포넌트 언마운트 시 이벤트 해제
    return () => {
      socket.off('users');
    };
  }, []);

  const refreshThis = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="userList-header">
        <h1 className="userList-title">MyApp-test UserList</h1>
        <div className="refresh-button" onClick={refreshThis}>
          <FontAwesomeIcon icon={faArrowRotateRight} />
        </div>
      </div>

      <div className="userList-body">
        {userList.length > 0
          ? userList.map((user) => (
              <div className="each-user" key={user.id}>
                <div className="user-name">{user.name}</div>
                <div
                  className={`user-online ${
                    user.online ? 'online' : 'offline'
                  }`}
                >
                  {user.online ? '●' : '●'}
                </div>
              </div>
            ))
          : null}
      </div>
    </>
  );
}
