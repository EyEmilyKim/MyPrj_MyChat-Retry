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

// 특정 키,값으로 룸 조회
roomService.checkRoom = async function (value, key) {
  // console.log('roomService.checkRoom called', value, key);
  try {
    const query = {};
    query[key] = value;
    const room = await Room.findOne(query);
    return room;
  } catch (error) {
    console.log('roomService.checkRoom error', error);
    throw new Error(error.message);
  }
};

module.exports = roomService;
