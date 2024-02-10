import { useEffect, useState } from 'react';

export default function useLocalRoomsData() {
  // 로컬 스토리지에서 roomsData 불러오기
  const getLocalRoomsData = () => {
    const storedData = localStorage.getItem('roomsData');
    return storedData ? JSON.parse(storedData) : [];
  };

  const [roomsData, setRoomsData] = useState(getLocalRoomsData);

  // roomsData 업데이트 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('roomsData', JSON.stringify(roomsData));
  }, [roomsData]);

  // rid로 해당하는 roomData 찾아서 업데이트하는 함수
  const updateRoomData = (rid, updateFunction) => {
    setRoomsData((prev) => {
      if (prev.length === 0) {
        return [updateFunction({ rid })];
      }
      const updatedRoomsData = prev.RoomsData.map((room) => {
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

  return {
    roomsData,
    updateJoinIndex,
    updateLastReadIndex,
  };
}
