const jwt = require('./jwt');

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
    const decoded = await jwt.verifyToken(accessToken, 'AT');
    socket.decoded = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed', err);
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
  io.use((socket, next) => {
    authenticateSocket(socket, next);
  });

  io.on('connection', (socket) => {
    console.log('Socket connected : ', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket disconnected : ', socket.id);
    });
  });
};
