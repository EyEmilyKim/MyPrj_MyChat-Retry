const User = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken, verifyToken } = require('../utils/jwt');

const userService = {};

// 유저 등록
userService.registerUser = async (email, pw, un) => {
  // console.log('userService.registerUser called', email, pw, un);
  try {
    // 이미 있는 유저인지 확인
    let user = await User.findOne({ email: email });
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
userService.loginUser = async (email, pw) => {
  // console.log('userService.loginUser called', email, pw);
  try {
    let user = await User.findOne({ email: email }); // 이미 있는 유저인지 확인
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
userService.saveConnectedUser = async function (email, sid) {
  console.log('userService.saveConnectedUser called');
  try {
    const user = await this.checkUser(email);
    user.online = true;
    user.sid = sid;
    await user.save();
  } catch (error) {
    console.log('userService.saveConnectedUser error', error);
    throw new Error(error.message);
  }
};

// 유저 로그아웃
userService.logoutUser = async (email) => {
  // console.log('userService.logoutUser called', email);
  const user = await User.findOne({ email: email });
  if (!user) throw new Error('user not found');
  user.online = false;
  await user.save();
  return user;
};

// 유저 확인
userService.checkUser = async function (email) {
  // console.log("userService.checkUser called", email);
  const user = await User.findOne({ email: email });
  if (!user) throw new Error('user not found');
  return user;
};

// 모든 유저 확인
userService.getAllUsers = async () => {
  // console.log('userService.getAllUsers called');
  try {
    const userList = await User.find({});
    console.log('userList', userList);
    return userList;
  } catch (error) {
    console.log('userService.getAllUsers error', error);
    throw new Error(error.message);
  }
};

module.exports = userService;
