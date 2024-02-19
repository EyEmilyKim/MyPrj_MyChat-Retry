import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../contexts/SocketContext';
import useStateLogger from './useStateLogger';

export default function useJoinedRoomsNotification(joinedRooms) {
  const { socket } = useContext(SocketContext);
  const [roomsNotification, setRoomsNotification] = useState({});
  useStateLogger(roomsNotification, 'roomsNotification');

  const getNotificationCount = (rid) => {
    return roomsNotification[rid] || 0;
  };

  const resetNotificationCount = async (rid) => {
    return new Promise((resolve) => {
      console.log('resetNotificationCount called', rid);
      setRoomsNotification((prev) => {
        const updatedNotification = { ...prev };
        delete updatedNotification[rid];
        localStorage.setItem('roomsNotification', JSON.stringify(updatedNotification));
        resolve(updatedNotification);
        return updatedNotification;
      });
    });
  };

  useEffect(() => {
    // 로컬 스토리지에서 알림 개수를 불러옴
    const savedNotification = JSON.parse(localStorage.getItem('roomsNotification')) || {};
    setRoomsNotification(savedNotification);

    // 모든 소속 룸에 이벤트 핸들러 추가
    joinedRooms.forEach((room) => {
      socket.on(`message-${room._id}`, (message) => {
        // 알림 개수 저장 로직
        setRoomsNotification((prev) => {
          const updatedCounts = {
            ...prev,
            [room._id]: (prev[room._id] || 0) + 1,
          };
          localStorage.setItem('roomsNotification', JSON.stringify(updatedCounts));
          return updatedCounts;
        });
      });
    });

    // 컴포넌트 언마운트 시 이벤트 삭제
    return () => {
      joinedRooms.forEach((room) => {
        socket.off(`message-${room._id}`);
      });
    };
  }, [joinedRooms, socket]);

  return {
    roomsNotification,
    getNotificationCount,
    resetNotificationCount,
  };
}
