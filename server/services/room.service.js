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

module.exports = roomService;
