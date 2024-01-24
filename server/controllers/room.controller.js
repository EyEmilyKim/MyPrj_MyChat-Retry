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

// 룸 입장
roomController.joinRoom = async (rid, user) => {
  // console.log('roomController.joinRoom called', rid, user);
  try {
    const room = await roomService.joinRoom(rid, user);
    return room;
  } catch (error) {
    console.log('roomController.joinRoom failed', error);
    throw new Error(error);
  }
};

module.exports = roomController;
