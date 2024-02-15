const User = require('../models/user');
const { dateFormatKST } = require('../utils/dateFormatKST');
const { v4: uuidv4 } = require('uuid');

const userService = {};

// 유저 등록
userService.registerUser = async function (email, hashedPW, un) {
  // console.log('userService.registerUser called', email, pw, un);
  try {
    const now = await dateFormatKST();
    const user = new User({
      email: email,
      password: hashedPW,
      name: un,
      online: false,
      created: now,
      // token: '',
      // sid: '',
    });
    await user.save();
    return user;
  } catch (error) {
    // console.log('userService.registerUser error', error);
    throw new Error(error.message);
  }
};

// 유저 로그인
userService.loginUser = async function (user, tokens) {
  // console.log('userService.loginUser called', user.email);
  try {
    user.token = tokens[0];
    user.online = true;
    await user.save();
    return user;
  } catch (error) {
    // console.log('userService.loginUser error', error);
    throw new Error(error.message);
  }
};

// 유저 소켓 Connected -> sid 저장
userService.updateConnectedUser = async function (user, sid) {
  // console.log('userService.updateConnectedUser called');
  try {
    user.sid = sid;
    await user.save();
  } catch (error) {
    // console.log('userService.updateConnectedUser error', error);
    throw new Error(error.message);
  }
};

// 유저 로그아웃
userService.logoutUser = async function (user) {
  // console.log('userService.logoutUser called', email);
  try {
    user.online = false;
    await user.save();
    return user;
  } catch (error) {
    // console.log('userService.logoutUser error', error);
    throw new Error(error.message);
  }
};

// 유저 소켓 disconnected -> sid: ''
userService.updateDisconnectedUser = async function (user) {
  // console.log('userService.updateDisconnectedUser called', sid);
  try {
    user.sid = '';
    await user.save();
    // console.log('disconnected user : ', user);
  } catch (error) {
    // console.log('userService.updateDisconnectedUser error', error);
    throw new Error(error.message);
  }
};

// 룸 입장 -> joinedRooms[]: room 추가
userService.joinRoom = async function (user, room) {
  // console.log('userService.joinRoom called', user, room);
  try {
    if (!user.joinedRooms.includes(room._id)) {
      // console.log('user.joinRoom, not include yet', user.joinedRooms);
      user.joinedRooms.push(room._id);
      await user.save();
      // console.log('user.joinRoom, now pushed', user.joinedRooms);
    }
    return user;
  } catch (error) {
    // console.log('userService.joinRoom error', error);
    throw new Error(error.message);
  }
};

// 룸 입장 -> roomIndexes[]: room, joinIndex 추가
userService.saveJoinIndex = async function (user, rid, joinIndex) {
  // console.log('userService.saveJoinIndex called', user, rid, joinIndex);
  try {
    const newRoomIndex = {
      room: rid,
      joinIndex: joinIndex,
    };
    user.roomIndexes.push(newRoomIndex);
    await user.save();
    return newRoomIndex;
  } catch (error) {
    // console.log('userService.saveJoinIndex error', error);
    throw new Error(error.message);
  }
};

// 룸 입장 -> 해당 roomIndex 조회
userService.getRoomIndex = async function (user, rid) {
  // console.log('userService.getRoomIndex called', user.email, rid);
  try {
    const roomIndex = await user.roomIndexes.find((item) => {
      return item.room.equals(rid);
    });
    // console.log('roomIndex', roomIndex);
    return roomIndex;
  } catch (error) {
    // console.log('userService.getRoomIndex error', error);
    throw new Error(error.message);
  }
};

// 룸 퇴장 -> joinedRooms[]: room 삭제
userService.leaveRoom = async function (user, room) {
  // console.log('userService.leaveRoom called', user, room);
  try {
    if (user.joinedRooms.includes(room._id)) {
      // console.log('user.joinRoom, does include yet', user.joinedRooms);
      user.joinedRooms.pull(room._id);
      await user.save();
      // console.log('user.joinRoom, now pulled', user.joinedRooms);
    }
    return user;
  } catch (error) {
    // console.log('userService.leaveRoom error', error);
    throw new Error(error.message);
  }
};

// 룸 퇴장 -> roomIndexes[]: 해당 roomIndex 삭제
userService.removeRoomIndex = async function (user, rid) {
  // console.log('userService.removeRoomIndex called', user.email, rid);
  try {
    const roomIndex = await user.roomIndexes.filter((item) => {
      return item.room.toString() !== rid;
    });
    // console.log('roomIndex', roomIndex);
    user.roomIndexes = roomIndex;
    await user.save();
  } catch (error) {
    // console.log('userService.removeRoomIndex error', error);
    throw new Error(error.message);
  }
};

// 해당 roomIndex에 lastReadIndex 저장
userService.saveLastReadeIndex = async function (user, rid, index) {
  // console.log('userService.saveLastReadeIndex called', user.email, rid, index);
  try {
    const roomIndexToUpdate = user.roomIndexes.find((item) => item.room.equals(rid));
    if (!roomIndexToUpdate) {
      throw new Error('해당하는 roomIndex를 찾을 수 없습니다');
    }
    roomIndexToUpdate.lastReadIndex = index;
    await user.save();
    return user;
  } catch (error) {
    // console.log('userService.saveLastReadeIndex error', error);
    throw new Error(error.message);
  }
};

// 유저 프로필 업데이트
userService.updateUser = async function (user, name, description) {
  // console.log(`userService.updateUser called : ${user.email} / ${name} / ${description}`);
  try {
    user.name = name;
    user.description = description;
    await user.save();
    return user;
  } catch (error) {
    // console.log('userService.updateUser error', error);
    throw new Error(error.message);
  }
};

// 비밀번호 업데이트
userService.resetPassword = async function (hashedPW, user) {
  // console.log(`userService.resetPassword called : ${user.email} / ${pw}`);
  try {
    user.password = hashedPW;
    await user.save();
    return user;
  } catch (error) {
    // console.log('userService.resetPassword error', error);
    throw new Error(error.message);
  }
};

// 유저 탈퇴 -> 닉네임, 이메일, 탈퇴일 처리
userService.resignUser = async function (user) {
  // console.log(`userService.resignUser called : ${user.email}`);
  try {
    const now = await dateFormatKST();
    user.resigned = now;
    user.email = `${uuidv4()}@resign.resign`;
    user.name = '탈퇴한 회원입니다';
    await user.save();
    return user;
  } catch (error) {
    // console.log('userService.resignUser error', error);
    throw new Error(error.message);
  }
};

// 특정 키,값으로 유저 조회 (original user)
userService.checkUser = async function (value, key) {
  // console.log('userService.checkUser called', value, key);
  try {
    const query = {};
    query[key] = value;
    const user = await User.findOne(query);
    return user;
  } catch (error) {
    // console.log('userService.checkUser error', error);
    throw new Error('user not found');
  }
};

// 모든 유저 조회 (original user)
userService.getAllUsers = async function () {
  // console.log('userService.getAllUsers called');
  try {
    const userList = await User.find({});
    // console.log('userList', userList);
    return userList;
  } catch (error) {
    // console.log('userService.getAllUsers error', error);
    throw new Error(error.message);
  }
};

module.exports = userService;
