const roomService = require('../services/room.service');
const userService = require('../services/user.Service');
const messageService = require('../services/message.service');
const User = require('../models/user');
const Message = require('../models/message');
const Room = require('../models/room');
const userController = require('./user.controller');

const roomController = {};

// 모든 룸 조회
roomController.getAllRooms = async function () {
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
roomController.joinRoom = async function (rid, socketId) {
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
    // 첫 입장 시 user, system message 저장
    let memberUpdate = result.memberUpdate;
    let roomIndex = null;
    if (memberUpdate) {
      user = await userService.joinRoom(user, result.room); // update User
      roomIndex = await this.saveSysMsg_roomInOut(user, 'in', rid) // systemMsg 저장
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
roomController.leaveRoom = async function (rid, socketId) {
  // console.log('roomController.leaveRoom called', rid, socketId);
  try {
    let user = await userService.checkUser(socketId, 'sid'); // 유저 정보 찾기
    let roomDeleted = false;
    const room = await roomService.checkRoom(rid, '_id').then(async (r) => {
      // 내가 오너이고
      if (user._id.equals(r.owner)) {
        // 마지막 멤버라면
        if ((r.members.length = 1)) {
          roomDeleted = true; // 룸 삭제 필요
        } else {
          // 남은 멤버가 있다면
          const newOwnerId = r.members.find((mem) => !mem._id.equals(user._id));
          const newOwner = await userService.checkUser(newOwnerId, '_id'); // 입장순이 빠른 유저에게
          await roomService.changeOwner(r, newOwner._id); // 오너 양도
          await this.saveSysMsg_changeOwner(user, newOwner, rid); // system message 저장
        }
      }
      // 퇴장 처리
      user = await userController.leaveRoom(user, r); // update User
      return await roomService.leaveRoom(r, user); // update Room
    });

    // 마지막 멤버가 퇴장했으면
    if (roomDeleted) {
      await this.deleteRoom(room); // 룸 삭제
      return { roomDeleted, user }; // 여기서 종료
    }

    // 해당 룸에 owner, members 정보 채우기
    const populatedRoom = await room
      .populate('owner', ['email', 'name'])
      .then((r) => r.populate('members', ['email', 'name']));
    // systemMsg 저장
    await this.saveSysMsg_roomInOut(user, 'out', rid);

    return { populatedRoom, user };
  } catch (error) {
    // console.log('roomController.leaveRoom failed', error);
    throw new Error(error);
  }
};

// 룸 오너 변경
roomController.changeOwner = async function (rid, newOwnerId, socketId) {
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
    await this.saveSysMsg_changeOwner(user, newOwner, rid);
    return populatedRoom;
  } catch (error) {
    // console.log('roomController.changeOwner failed', error);
    throw new Error(error.message);
  }
};

// 룸 삭제
roomController.deleteRoom = async function (room) {
  console.log('roomController.deleteRoom called', room.title);
  try {
    // 룸 멤버 joinedRoom 해당 건 삭제
    await User.updateMany({ _id: { $in: room.members } }, { $pull: { joinedRooms: room._id } });
    // 해당 룸 귀속 메세지 모두 삭제
    await Message.deleteMany({ room: room._id });
    // 해당 룸 삭제
    await Room.deleteOne({ _id: room._id });
  } catch (error) {
    console.log('roomController.deleteRoom failed', error);
    throw new Error(error.message);
  }
};

// ------------ system message 관련 ------------------

// 유저 입장, 퇴장 알림
roomController.saveSysMsg_roomInOut = async function (user, inOut, rid) {
  // console.log('roomController.saveSysMsg_roomInOut called', user.email, inOut, rid);
  try {
    const systemId = process.env.SYSTEM_USER_ID;
    let content = '';
    if (inOut === 'in') content = `${user.name} joined this room`;
    else if (inOut === 'out') content = `${user.name} left this room`;
    else throw new Error('invalid argument for inOut param');
    return await messageService.saveSystemMessage(content, systemId, rid); // 입장 시 joinIndex 반환
  } catch (error) {
    // console.log('roomController.saveSysMsg_roomInOut Error : ', error);
    throw new Error(error);
  }
};

// 오너 변경 알림
roomController.saveSysMsg_changeOwner = async function (user, newOwner, rid) {
  // console.log('roomController.saveSysMsg_changeOwner called');
  try {
    const systemId = process.env.SYSTEM_USER_ID;
    const content = `The room owner is changed from ${user.name} to ${newOwner.name}`;
    await messageService.saveMessage(content, systemId, rid);
  } catch (error) {
    // console.log('roomController.saveSysMsg_changeOwner Error : ', error);
    throw new Error(error);
  }
};

module.exports = roomController;
