import { createContext, useContext, useEffect, useState } from 'react';
import { useSocketContext } from './SocketContext';
import useClassifyRooms from '../hooks/useClassifyRooms';
import useJoinedRoomsNotification from '../hooks/useJoinedRoomsNotification';
import useStateLogger from '../hooks/useStateLogger';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { socket } = useSocketContext();

  const [userList, setUserList] = useState([]);
  // useStateLogger(userList, 'userList');

  const [roomList, setRoomList] = useState([]);
  const { joinedRooms, notMyRooms, classifyRooms } = useClassifyRooms();
  const { getNotificationCount, resetNotificationCount, stackNotificationCount } =
    useJoinedRoomsNotification(joinedRooms);
  // useStateLogger(roomsNotification, 'roomsNotification');

  useEffect(() => {
    classifyRooms(roomList);
  }, [roomList]);

  useEffect(() => {
    if (socket && socket.connected) {
      console.log(`socket : ${socket.id}`);

      socket.emit('getUsers', (res) => {
        // console.log('getUsers res', res);
        setUserList(res.data);
      });

      socket.on('users', (reason, users) => {
        console.log(`on('users') ${reason}`, users);
        setUserList(users);
      });

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
        socket.off('users');
        socket.off('rooms');
      };
    }
  }, [socket]);

  const contextValue = {
    userList,
    joinedRooms,
    notMyRooms,
    getNotificationCount,
    resetNotificationCount,
    stackNotificationCount,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  return useContext(DataContext);
};
