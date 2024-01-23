const jwt = require('./jwt');
const { parseCookies } = require('./parseCookies');

// 연결된 웹소켓 출력 관련...
const connectedSockets = [];

function printConnectedSockets() {
  console.log(`---------Connected WebSockets---------`);
  connectedSockets.forEach(({ email, sid }) => {
    console.log(`${email} - (sid) ${sid}`);
  });
  console.log(`--------------------------------------`);
}

async function addConnectedSocket(email, sid) {
  connectedSockets.push({ email: email, sid: sid });
  // printConnectedSockets();
}

async function deleteConnectedSocket(sid) {
  connectedSockets.splice(
    connectedSockets.findIndex((item) => item.sid === sid),
    1
  );
  // printConnectedSockets();
}

// JWT 인증 미들웨어
async function authenticateSocket(socket, next) {
  // console.log('authenticateSocket called');
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) {
    return next(
      new Error(
        'Socket Authentication error A - There is no cookie-header provided'
      )
    );
  }
  // 쿠키 파싱
  const cookies = await parseCookies(cookieHeader);
  const accessToken = cookies.accessToken;
  // 토큰 확인 로직
  try {
    const tokenDecoded = await jwt.verifyToken(accessToken, 'AT');
    socket.decoded = tokenDecoded; // 소켓에 인증 정보 저장
    next(); // 다음 미들웨어로 이동
  } catch (error) {
    console.error('Token verification failed', error);
    return next(
      new Error('Socket Authentication error B - Token Verification failed')
    );
  }
}

module.exports = {
  authenticateSocket,
  addConnectedSocket,
  deleteConnectedSocket,
};
