const Room = require('../models/room');

const roomService = {};

// 모든 룸 조회
roomService.getAllRooms = async function () {
  // console.log('roomService.getAllRooms called');
  try {
    const roomList = await Room.find({});
    // console.log('roomList', roomList);
    return roomList;
  } catch (error) {
    console.log('roomService.getAllRooms error', error);
    throw new Error(error.message);
  }
};

// rid 로 룸 조회
roomService.checkRoom = async (rid) => {
  // console.log('roomService.checkRoom called');
  try {
    const room = await Room.findById(rid);
    return room;
  } catch (error) {
    console.log('roomService.checkRoom error', error);
    throw new Error(error.message);
  }
};

module.exports = roomService;
