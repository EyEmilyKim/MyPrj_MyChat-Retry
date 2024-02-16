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
    let roomIndex = null;
    if (memberUpdate) {
      user = await userService.joinRoom(user, result.room); // update User
      const systemId = process.env.SYSTEM_USER_ID;
      const content = `${user.name} joined this room`;
      roomIndex = await messageService
        .saveSystemMessage(content, systemId, rid) // systemMsg 저장
        .then(async (systemMsgIndex) => {
          return await userService.saveJoinIndex(user, rid, systemMsgIndex); // joinIndex 저장
        });
    } else {
      roomIndex = await userService.getRoomIndex(user, rid);
    }
    return { populatedRoom, memberUpdate, user, roomIndex };
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
          // 룸 오너일 경우
          if (user._id.equals(r.owner)) {
            // 2명 이상 방에서
            if (r.members.length >= 2) {
              // 입장순 빠른 타인에게
              const newOwnerId = r.members.find((mem) => !mem._id.equals(user._id));
              const newOwner = await userService.checkUser(newOwnerId, '_id');
              if (newOwner) {
                // 오너 양도
                await roomService.changeOwner(r, newOwner._id);
                // system message 저장
                const systemId = process.env.SYSTEM_USER_ID;
                const content = `The room owner is changed from ${user.name} to ${newOwner.name}`;
                await messageService.saveMessage(content, systemId, rid);
              }
            }
          }
          // 퇴장
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
      await messageService.saveMessage(content, systemId, rid); // systemMsg 저장
      await userService.removeRoomIndex(user, rid); // 해당 roomIndex 삭제
    }
    return { populatedRoom, memberUpdate, user };
  } catch (error) {
    // console.log('roomController.leaveRoom failed', error);
    throw new Error(error);
  }
};

// 룸 오너 변경
roomController.changeOwner = async (rid, newOwnerId, socketId) => {
  // console.log('roomController.changeOwner called', rid, newOwnerId, socketId);
  try {
    const room = await roomService
      .checkRoom(rid, '_id')
      .then((r) => roomService.changeOwner(r, newOwnerId));
    // 해당 룸에 owner, members 정보 채우기
    const populatedRoom = await room
      .populate('owner', ['email', 'name'])
      .then((r) => r.populate('members', ['email', 'name']));
    // system message 저장
    const user = await userService.checkUser(socketId, 'sid');
    const newOwner = await userService.checkUser(newOwnerId, '_id');
    const systemId = process.env.SYSTEM_USER_ID;
    const content = `The room owner is changed from ${user.name} to ${newOwner.name}`;
    await messageService.saveMessage(content, systemId, rid);
    return populatedRoom;
  } catch (error) {
    // console.log('roomController.changeOwner failed', error);
    throw new Error(error.message);
  }
};

module.exports = roomController;
