const Room = require('../models/room');
const db = require('../utils/db');

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
    // await db.isInstance(room, 'roomServ.checkRoom room'); // true
    return room;
  } catch (error) {
    console.log('roomService.checkRoom error', error);
    throw new Error(error.message);
  }
};

// 룸 입장 -> members[]: user 추가
roomService.joinRoom = async function (room, user) {
  // console.log('roomService.joinRoom called', room, user);
  if (!room) {
    throw new Error('해당 방이 존재하지 않습니다.');
  }
  if (!room.members.includes(user._id)) {
    room.members.push(user._id);
    await room.save();
  }
  return room;
};

module.exports = roomService;
