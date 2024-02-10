const roomService = require('../services/room.service');
const userService = require('../services/user.Service');
const messageService = require('../services/message.service');

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
roomController.createRoom = async (title, socketId) => {
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
roomController.joinRoom = async (rid, socketId) => {
  // console.log('roomController.joinRoom called', rid, user);
  try {
    // 룸 입장 처리
    let user = await userService.checkUser(socketId, 'sid'); // 유저 정보 찾기
    const result = await roomService
      .checkRoom(rid, '_id') // 룸 정보 찾기
      .then(async (r) => {
        if (!r) {
          throw new Error('해당 방이 존재하지 않습니다.');
        } else {
          return await roomService.joinRoom(r, user); // update Room
        }
      });
    // 해당 룸에 owner, members 정보 채우기
    const populatedRoom = await result.room
      .populate('owner', ['email', 'name'])
      .then((r) => r.populate('members', ['email', 'name']));
    // member변동 있으면 user, system message 저장
    let memberUpdate = result.memberUpdate;
    let joinMsgIndex = -1;
    if (memberUpdate) {
      user = await userService.joinRoom(user, result.room); // update User
      const systemId = process.env.SYSTEM_USER_ID;
      const content = `${user.name} joined this room`;
      joinMsgIndex = await messageService.saveSystemMessage(content, systemId, rid);
    }
    return { populatedRoom, memberUpdate, user, joinMsgIndex };
  } catch (error) {
    // console.log('roomController.joinRoom failed', error);
    throw new Error(error);
  }
};

// 룸 퇴장
roomController.leaveRoom = async (rid, socketId) => {
  // console.log('roomController.leaveRoom called', rid, user);
  try {
    let user = await userService.checkUser(socketId, 'sid'); // 유저 정보 찾기
    const result = await roomService
      .checkRoom(rid, '_id') // 룸 정보 찾기
      .then(async (r) => {
        if (!r) {
          throw new Error('해당 방이 존재하지 않습니다.');
        } else {
          return await roomService.leaveRoom(r, user);
        }
      });
    // 해당 룸에 owner, members 정보 채우기
    const populatedRoom = await result.room
      .populate('owner', ['email', 'name'])
      .then((r) => r.populate('members', ['email', 'name']));
    // member변동 있으면 user, system message 저장
    let memberUpdate = result.memberUpdate;
    if (memberUpdate) {
      user = await userService.leaveRoom(user, result.room); // update User
      const systemId = process.env.SYSTEM_USER_ID;
      const content = `${user.name} left this room`;
      await messageService.saveMessage(content, systemId, rid);
    }
    return { populatedRoom, memberUpdate, user };
  } catch (error) {
    // console.log('roomController.leaveRoom failed', error);
    throw new Error(error);
  }
};

module.exports = roomController;
