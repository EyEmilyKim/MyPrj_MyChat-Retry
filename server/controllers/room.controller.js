const roomService = require('../services/room.service');
const { v4: uuidv4 } = require('uuid');

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
    const result = await roomService
      .checkRoom(rid, '_id')
      .then((r) => roomService.joinRoom(r, user));
    // 해당 룸에 owner, members 정보 채우기
    const populatedRoom = await result.room
      .populate('owner', ['email', 'name'])
      .then((r) => r.populate('members', ['email', 'name']));
    // member변동 있으면 메시지 준비
    let updateMessage = null;
    if (result.memberUpdate) {
      updateMessage = {
        _id: uuidv4(),
        room: rid,
        sender: { _id: uuidv4(), name: 'system' },
        content: `${user.name} joined this room`,
      };
    }
    return { populatedRoom, updateMessage };
  } catch (error) {
    console.log('roomController.joinRoom failed', error);
    throw new Error(error);
  }
};

// 룸 퇴장
roomController.leaveRoom = async (rid, user) => {
  // console.log('roomController.leaveRoom called', rid, user);
  try {
    const room = await roomService
      .checkRoom(rid, '_id')
      .then((r) => roomService.leaveRoom(r, user));
    // 해당 룸에 owner, members 정보 채우기
    const populatedRoom = await room
      .populate('owner', ['email', 'name'])
      .then((r) => r.populate('members', ['email', 'name']));
    return populatedRoom;
  } catch (error) {
    console.log('roomController.leaveRoom failed', error);
    throw new Error(error);
  }
};

module.exports = roomController;
