import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import useStateLogger from '../hooks/useStateLogger';

export default function useLocalRoomsData() {
  const { user } = useContext(LoginContext);

  // 로컬 스토리지에서 roomsData 불러오기
  const getLocalRoomsData = () => {
    const storedData = localStorage.getItem(`roomsData_${user._id}`);
    return storedData ? JSON.parse(storedData) : [];
  };

  const [roomsData, setRoomsData] = useState(getLocalRoomsData);
  // useStateLogger(roomsData, 'roomsData');

  // roomsData 업데이트 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(`roomsData_${user._id}`, JSON.stringify(roomsData));
  }, [roomsData]);

  // rid로 해당하는 roomData 찾아서 업데이트하는 함수
  const updateRoomData = (rid, updateFunction) => {
    setRoomsData((prev) => {
      if (prev.length === 0) {
        return [updateFunction({ rid })];
      }
      const updatedRoomsData = prev.map((room) => {
        if (room.rid === rid) {
          return updateFunction(room);
        }
        return room;
      });
      return updatedRoomsData;
    });
  };

  // joinIndex 업데이트 함수
  const updateJoinIndex = (rid, joinIndex) => {
    console.log('updateJoinIndex called', rid, joinIndex);
    updateRoomData(rid, (room) => ({ ...room, joinIndex }));
  };

  // lastReadIndex 업데이트 함수
  const updateLastReadIndex = (rid, lastReadIndex) => {
    console.log('updateLastReadIndex called', rid, lastReadIndex);
    updateRoomData(rid, (room) => ({ ...room, lastReadIndex }));
  };

  // rid 해당 룸의 joinIndex 읽어오는 함수
  const getJoinIndex = (rid) => {
    const room = roomsData.find((room) => room.rid === rid);
    return room ? room.joinIndex : null;
  };

  // rid로 해당하는 roomData 찾아서 삭제하는 함수
  const removeRoomData = (rid) => {
    console.log('removeRoomData called', rid);
    setRoomsData((prev) => {
      const updatedRoomsData = prev.filter((room) => room.rid !== rid);
      console.log('updatedRoomsData', updatedRoomsData);
      // 로컬 스토리지에 안전하게 반영
      localStorage.setItem(`roomsData_${user._id}`, JSON.stringify(updatedRoomsData));
      return updatedRoomsData;
    });
  };

  return {
    roomsData,
    updateJoinIndex,
    updateLastReadIndex,
    getJoinIndex,
    removeRoomData,
  };
}
