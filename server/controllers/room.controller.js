const roomService = require('../services/room.service');

const roomController = {};

// 모든 룸 조회
roomController.getAllRooms = async () => {
  // console.log('roomController.getAllRooms called');
  try {
    const roomList = await roomService.getAllRooms();
    return roomList;
  } catch (error) {
    console.log('roomController.getAllRooms failed', error);
    throw new Error(error);
  }
};

// rid 로 룸 조회
roomController.checkRoom = async (rid) => {
  // console.log('roomController.checkRoom called');
  try {
    const room = await roomService.checkRoom(rid);
    // console.log('checkRoom', room);
    return room;
  } catch (error) {
    console.log('roomController.checkRoom failed', error);
    throw new Error(error);
  }
};

module.exports = roomController;
