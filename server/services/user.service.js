const User = require('../models/user');
const db = require('../utils/db');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken, verifyToken } = require('../utils/jwt');

const userService = {};

// 유저 등록
userService.registerUser = async function (email, pw, un) {
  // console.log('userService.registerUser called', email, pw, un);
  try {
    // 이미 있는 유저인지 확인
    let user = await this.checkUser(email, 'email');
    if (user) {
      throw new Error('이미 사용중인 이메일입니다.');
    } else {
      // -> 없으면 새로 저장
      const hashedPW = await hashPassword(pw);
      user = new User({
        email: email,
        password: hashedPW,
        name: un,
        online: false,
        // token: '',
        // sid: '',
      });
      await user.save();
      return user;
    }
  } catch (error) {
    console.log('userService.registerUser error', error);
    throw new Error(error.message);
  }
};

// 유저 로그인
userService.loginUser = async function (email, pw) {
  // console.log('userService.loginUser called', email, pw);
  try {
    let user = await this.checkUser(email, 'email'); // 이미 있는 유저인지 확인
    if (!user) {
      throw new Error('이메일 또는 비밀번호가 유효하지 않습니다.');
    }
    // -> 있다면 비밀번호 조회 후 일치하면 JWT 발급, 로그인
    const passwordMatch = await comparePassword(pw, user.password);
    if (!passwordMatch) {
      throw new Error('이메일 또는 비밀번호가 유효하지 않습니다.');
    }

    const accessToken = await generateToken(user, 'AT');
    const refreshToken = await generateToken(user, 'RT');
    user.token = accessToken;
    user.online = true;

    await user.save();

    return { user, accessToken, refreshToken };
  } catch (error) {
    console.log('userService.loginUser error', error);
    throw new Error(error.message);
  }
};
// 유저 소켓 Connected -> sid 저장
userService.updateConnectedUser = async function (email, sid) {
  // console.log('userService.updateConnectedUser called');
  try {
    const user = await this.checkUser(email, 'email');
    user.online = true;
    user.sid = sid;
    await user.save();
  } catch (error) {
    console.log('userService.updateConnectedUser error', error);
    throw new Error(error.message);
  }
};

// 유저 로그아웃
userService.logoutUser = async function (email) {
  // console.log('userService.logoutUser called', email);
  try {
    const user = await this.checkUser(email, 'email');
    user.online = false;
    await user.save();
    return user;
  } catch (error) {
    console.log('userService.logoutUser error', error);
    throw new Error(error.message);
  }
};
// 유저 소켓 disconnected -> online:false, sid:''
userService.updateDisconnectedUser = async function (sid) {
  // console.log('userService.updateDisconnectedUser called', sid);
  try {
    const user = await this.checkUser(sid, 'sid');
    if (user) {
      user.online = false;
      user.sid = '';
      await user.save();
    }
    // console.log('disconnected user : ', user);
  } catch (error) {
    console.log('userService.updateDisconnectedUser error', error);
    throw new Error(error.message);
  }
};

// 특정 키,값으로 유저 조회
userService.checkUser = async function (value, key) {
  // console.log('userService.checkUser called', value, key);
  try {
    const query = {};
    query[key] = value;
    const user = await User.findOne(query);
    // await db.isInstance(user, 'userServ.checkUser user'); // true
    return user;
  } catch (error) {
    throw new Error('user not found');
  }
};

// 모든 유저 조회
userService.getAllUsers = async function () {
  // console.log('userService.getAllUsers called');
  try {
    const userList = await User.find({});
    // console.log('userList', userList);
    return userList;
  } catch (error) {
    console.log('userService.getAllUsers error', error);
    throw new Error(error.message);
  }
};

// 유저 객체or배열에서 name, id, online 만 추출하기
userService.extractNameIdOnline = async function (users) {
  const NameIdOnlineOfUser = async (user) => {
    if (Array.isArray(user)) {
      // 배열인 경우
      return user.map((u) => ({
        id: u.id,
        name: u.name,
        online: u.online,
      }));
    } else if (typeof user === 'object') {
      // 단일 객체인 경우
      return {
        id: user.id,
        name: user.name,
        online: user.online,
      };
    } else {
      throw new Error(
        'userService.extractNameIdOnline Error - Invalid parameter type'
      );
    }
  };
  const extractData = await NameIdOnlineOfUser(users);
  // console.log('extractData', extractData);
  return extractData;
};

module.exports = userService;
