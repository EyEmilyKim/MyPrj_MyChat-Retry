const jwt = require('./jwt');
const userController = require('../controllers/user.controller');

// JWT 인증 미들웨어
async function authenticateSocket(socket, next) {
  // console.log('authenticateSocket called');

  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) {
    return next(new Error('Socket Authentication error A'));
  }
  // 쿠키 파싱
  const cookies = await parseCookies(cookieHeader);
  const accessToken = cookies.accessToken;
  // 토큰 확인 로직
  try {
    const tokenDecoded = await jwt.verifyToken(accessToken, 'AT');
    socket.decoded = tokenDecoded;
    next();
  } catch (error) {
    console.error('Token verification failed', error);
    return next(new Error('Socket Authentication error B'));
  }
}

// 쿠키 파싱 함수
async function parseCookies(cookieHeader) {
  const cookies = {};
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    cookies[parts[0].trim()] = parts[1].trim();
  });
  return cookies;
}

module.exports = function (io) {
  io.use(async (socket, next) => {
    await authenticateSocket(socket, next);
  });

  io.on('connection', async (socket) => {
    // console.log('socket.decoded', socket.decoded);
    console.log(
      `Socket connected for ${socket.decoded.email}, socketId : ${socket.id}`
    );
    await userController.updateConnectedUser(socket.decoded.email, socket.id);
    socket.emit('users', await userController.listAllUsers());

    socket.on('getUsers', async () => {
      try {
        const userList = await userController.listAllUsers();
        socket.emit('users', userList);
      } catch (error) {
        console.error('Error fetching users : ', error);
      }
    });

    socket.on('logout', () => {
      console.log('Logout requested, disconnecting socket');
      socket.disconnect(true);
    });

    socket.on('disconnect', async (reason) => {
      await userController.updateDisconnectedUser(socket.id);
      socket.emit('users', await userController.listAllUsers());
      console.log(`Socket disconnected by [${reason}] : ${socket.id}`);
    });
  });
};
