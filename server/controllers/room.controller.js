const roomService = require('../services/room.service');
const { v4: uuidv4 } = require('uuid');
const userService = require('../services/user.Service');

const roomController = {};

// 모든 룸 조회
roomController.getAllRooms = async () => {
  // console.log('roomController.getAllRooms called');
  try {
    const roomList = await roomService.getAllRooms();
    return roomList;
  } catch (error) {
    // console.log('roomController.getAllRooms failed', error);
    throw new Error(error);
  }
};

// 룸 생성
roomController.createRoom = async function (title, socketId) {
  // console.log('roomController.createRoom called', title, user);
  try {
    let providingError = null;
    let room = null;
    // 이미 있는 방 제목인지 확인
    const isExistingTitle = await roomService.checkRoom(title, 'title');
    if (isExistingTitle) {
      providingError = '이미 존재하는 방제목입니다.';
    } else {
      // -> 없으면 새로 저장
      const user = await userService.checkUser(socketId, 'sid'); // 유저정보 찾기
      room = await roomService.createRoom(title, user._id);
    }
    return { room, providingError };
  } catch (error) {
    // console.log('roomController.createRoom failed', error);
    throw new Error(error.message);
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
    // console.log('roomController.joinRoom failed', error);
    throw new Error(error);
  }
};

// 룸 퇴장
roomController.leaveRoom = async (rid, user) => {
  // console.log('roomController.leaveRoom called', rid, user);
  try {
    const result = await roomService
      .checkRoom(rid, '_id')
      .then((r) => roomService.leaveRoom(r, user));
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
        content: `${user.name} left this room`,
      };
    }
    return { populatedRoom, updateMessage };
  } catch (error) {
    // console.log('roomController.leaveRoom failed', error);
    throw new Error(error);
  }
};

module.exports = roomController;
