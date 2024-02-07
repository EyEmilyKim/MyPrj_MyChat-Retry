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
    // console.log('roomService.getAllRooms error', error);
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
    // console.log('roomService.checkRoom error', error);
    throw new Error(error.message);
  }
};

// 룸 생성
roomService.createRoom = async function (title, user) {
  // console.log('roomService.createRoom called', title, user);
  try {
    // 이미 있는 방 제목인지 확인
    let isExistingTitle = await this.checkRoom(title, 'title');
    if (isExistingTitle) {
      throw new Error('이미 존재하는 방제목입니다.');
    } else {
      // -> 없으면 새로 저장
      const now = await dateFormatKST();
      const room = new Room({
        title: title,
        owner: user._id,
        created: now,
      });
      await room.save();
      return room;
    }
  } catch (error) {
    // console.log('roomService.createRoom error', error);
    throw new Error(error.message);
  }
};

// 룸 입장 -> members[]: user 추가
roomService.joinRoom = async function (room, user) {
  // console.log('roomService.joinRoom called', room);
  try {
    if (!room) {
      throw new Error('해당 방이 존재하지 않습니다.');
    }
    let memberUpdate = false;
    if (!room.members.includes(user._id)) {
      // console.log('room.joinRoom, not include yet', room.members);
      room.members.push(user._id);
      await room.save();
      memberUpdate = true;
      // console.log('room.joinRoom, now pushed', memberUpdate, room.members);
    }
    return { room, memberUpdate };
  } catch (error) {
    // console.log('roomService.joinRoom error', error);
    throw new Error(error.message);
  }
};

// 룸 퇴장 -> members[]: user 제거
roomService.leaveRoom = async function (room, user) {
  // console.log('roomService.leaveRoom called', room, user);
  try {
    if (!room) {
      throw new Error('해당 방이 존재하지 않습니다.');
    }
    let memberUpdate = false;
    if (room.members.includes(user._id)) {
      // console.log('room.leaveRoom, does include yet', room.members);
      room.members.pull(user._id);
      await room.save();
      memberUpdate = true;
      // console.log('room.leaveRoom, now pulled', memberUpdate, room.members);
    }
    return { room, memberUpdate };
  } catch (error) {
    // console.log('roomService.leaveRoom error', error);
    throw new Error(error.message);
  }
};

module.exports = roomService;
