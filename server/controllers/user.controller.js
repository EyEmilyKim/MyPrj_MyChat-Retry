const userService = require('../services/user.Service');
const jwt = require('../utils/jwt');

const userController = {};

// 유저 등록
userController.registerUser = async (req, res) => {
  // console.log('userController.registerUser called', req.body);
  try {
    const { email, password, userName } = req.body;
    const user = await userService.registerUser(email, password, userName);
    console.log('user', user);
    res.status(200).json({ message: '등록 성공', user: user });
  } catch (error) {
    console.log('userController.registerUser failed', error);
    res.status(500).json({ error: error.message });
  }
};

// 유저 로그인
userController.loginUser = async (req, res) => {
  // console.log('userController.loginUser called', req.body);
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await userService.loginUser(
      email,
      password
    );
    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
      })
      .status(200)
      .json({ message: '로그인 성공', user: user });
    // console.log('userController.loginUser success');
  } catch (error) {
    console.log('userController.loginUser failed', error);
    res.status(500).json({ error: error.message });
  }
};

// 유저 로그인 유지
userController.loginSuccess = async (req, res) => {
  // console.log('userController.loginSuccess called');
  try {
    const accessToken = req.cookies.accessToken;
    const data = jwt.verifyToken(accessToken, 'AT');
    const user = await userService.checkUser(data.email);

    res.status(200).json({ message: '인증 성공', user: user });
  } catch (error) {
    // console.log('userController.loginSuccess failed');
    res.status(500).json({ error: error.message });
  }
};

// 유저 로그아웃
userController.logoutUser = async (req, res) => {
  // console.log('userController.logout called');
  try {
    const accessToken = req.cookies.accessToken;
    const data = jwt.verifyToken(accessToken, 'AT');
    const user = await userService.logoutUser(data.email);
    if (!user.online) {
      res.cookie('accessToken', '');
      res.status(200).json({ message: '로그아웃 성공', user: user });
    }
  } catch (error) {
    console.log('userController.logout failed', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = userController;
