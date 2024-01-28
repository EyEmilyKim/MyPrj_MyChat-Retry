const {
  authenticateSocket,
  // checkDuplicatedSocket,
  // addConnectedSocket,
  // deleteConnectedSocket,
} = require('./io-middlewares');
const userController = require('../controllers/user.controller');
const userService = require('../services/user.Service');
const roomController = require('../controllers/room.controller');

// 연결된 모든 소켓 출력하는 함수
async function printAllSockets(io) {
  const allSockets = io.sockets.sockets;
  // console.log('allSockets', allSockets);
  console.log('-------- All connected sockets --------');
  for (const [socketId, socket] of allSockets) {
    console.log(
      `${socket.decoded.email} - ${socketId}, Connected: ${socket.connected}`
    );
  }
  console.log('----------------------------------------');
}

module.exports = function (io) {
  io.use(async (socket, next) => {
    await authenticateSocket(socket, next);
  }); // JWT 인증 미들웨어
  // io.use(async (socket, next) => {
  //   await checkDuplicatedSocket(socket, next);
  // }); // 1인1소켓 미들웨어

  io.on('connection', async (socket) => {
    // 소켓 연결 시
    // 서버 로그
    console.log(
      `Socket connected for ${socket.decoded.email}, by [${socket.handshake.query.reason}] : ${socket.id}`
    );
    // await addConnectedSocket(socket.decoded.email, socket.id); // 소켓정보 배열에 추가(+목록 출력)
    await printAllSockets(io);
    await userController.updateConnectedUser(socket.decoded.email, socket.id);
    // 유저 on/offline 정보 발신
    const userList = await userController.listAllUsers('Someone connected');
    io.emit('users', 'Someone connected', userList);

    // 유저 목록 요청
    socket.on('getUsers', async (cb) => {
      try {
        const userList = await userController.listAllUsers('UserList loaded');
        cb({ status: 'ok', data: userList });
      } catch (error) {
        console.error('Error fetching users : ', error);
        cb({ status: 'Server side Error' });
      }
    });

    // 룸 목록 요청
    socket.on('getRooms', async (cb) => {
      try {
        const roomList = await roomController.getAllRooms();
        cb({ status: 'ok', data: roomList });
      } catch (error) {
        console.log('getRooms Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // 룸 입장 시
    socket.on('joinRoom', async (rid, cb) => {
      console.log(`socket.on('joinRoom') called`);
      try {
        const user = await userService.checkUser(socket.id, 'sid'); // 유저정보 찾기
        const room = await roomController.joinRoom(rid, user); // 룸 입장
        const ridToString = rid.toString();
        socket.join(ridToString); //해당 룸채널 조인
        //해당 룸채널에 입장 메세지 발신
        const welcomeMessage = {
          content: `${user.name} joined this room`,
          user: { _id: null, name: 'system' },
        };
        io.to(ridToString).emit('welcomeMessage', welcomeMessage);
        //실시간 룸정보 전체 발신
        const roomList = await roomController.getAllRooms(
          'Someone joined somewhere'
        );
        io.emit('rooms', 'Someone joined somewhere', roomList);

        cb({ status: 'ok', data: { room: room } });
      } catch (error) {
        console.log('io > joinRoom Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // 로그아웃 요청
    socket.on('logout', () => {
      console.log('Logout requested, disconnecting socket');
      socket.disconnect(true);
    });

    // 소켓 연결 해제 시
    socket.on('disconnect', async (reason) => {
      await userController.updateDisconnectedUser(socket.id);
      // 유저 on/offline 정보 발신
      const userList = await userController.listAllUsers(
        'Someone disconnected'
      );
      io.emit('users', 'Someone disconnected', userList);
      // 서버 로그
      console.log(
        `Socket disconnected for ${socket.decoded.email}, by [${reason}] : ${socket.id}`
      );
      // await deleteConnectedSocket(socket.id); // 소켓정보 배열에서 제거(+목록 출력)
      await printAllSockets(io);
    });
  });
};
