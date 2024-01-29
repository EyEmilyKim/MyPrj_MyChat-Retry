const {
  authenticateSocket,
  // checkDuplicatedSocket,
} = require('./io-middlewares');
const userController = require('../controllers/user.controller');
const userService = require('../services/user.Service');
const roomController = require('../controllers/room.controller');
const roomService = require('../services/room.service');
const messageService = require('../services/message.service');
const { v4: uuidv4 } = require('uuid');

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
    // ** 소켓 연결 시
    console.log(
      `Socket connected for ${socket.decoded.email}, by [${socket.handshake.query.reason}] : ${socket.id}`
    );
    try {
      // 소켓 목록 출력
      await printAllSockets(io);
      // 유저 on/offline 저장
      await userController.updateConnectedUser(socket.decoded.email, socket.id);
      // 실시간 유저 정보 전체 발신
      const userList = await userController.listAllUsers('Someone connected');
      io.emit('users', 'Someone connected', userList);
    } catch (error) {
      console.error('io > connection Error', error);
    }

    // ** 유저 목록 요청
    socket.on('getUsers', async (cb) => {
      console.log(`'getUsers' called by : `, socket.decoded.email);
      try {
        const userList = await userController.listAllUsers('UserList loaded');
        cb({ status: 'ok', data: userList });
      } catch (error) {
        console.error('io > getUsers Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 룸 목록 요청
    socket.on('getRooms', async (cb) => {
      console.log(`'getRooms' called by : `, socket.decoded.email);
      try {
        const roomList = await roomController.getAllRooms();
        cb({ status: 'ok', data: roomList });
      } catch (error) {
        console.log('io > getRooms Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 룸 입장 시
    socket.on('joinRoom', async (rid, cb) => {
      console.log(`'joinRoom' called by :`, socket.decoded.email);
      try {
        const user = await userService.checkUser(socket.id, 'sid'); // 유저정보 찾기
        const room = await roomController.joinRoom(rid, user); // 룸 입장
        // 해당 룸채널 조인
        const ridToString = rid.toString();
        socket.join(ridToString);
        // 룸채널에 입장 메세지 발신
        const welcomeMessage = {
          _id: uuidv4(),
          room: rid,
          sender: { _id: uuidv4(), name: 'system' },
          content: `${user.name} joined this room`,
        };
        io.to(ridToString).emit('message', welcomeMessage);
        // 실시간 룸정보 전체 발신
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

    // ** 메세지 수신 시
    socket.on('sendMessage', async (receivedMsg, rid, cb) => {
      console.log(
        `'sendMessage' called by : ${socket.decoded.email}, ${receivedMsg}, ${rid}`
      );
      try {
        // 유저, 룸 정보 찾기
        const user = await userService.checkUser(socket.id, 'sid');
        const room = await roomService.checkRoom(rid, '_id');
        if (user && room) {
          // 메세지 저장
          const newMsg = await messageService.saveMessage(
            receivedMsg,
            user,
            room
          );
          // 해당 룸에 메세지(sender 정보 채워서) 보냄
          const populatedMsg = await newMsg.populate('sender', [
            'email',
            'name',
          ]);
          // console.log('populatedMsg', populatedMsg);
          io.to(rid).emit('message', populatedMsg);

          cb({ status: 'ok' });
        } else {
          throw new Error('room 또는 user 정보를 찾을 수 없습니다');
        }
      } catch (error) {
        console.log('io > sendMessage Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 로그아웃 요청
    socket.on('logout', (cb) => {
      console.log('Logout requested, disconnecting socket');
      try {
        socket.disconnect(true);
      } catch (error) {
        console.log('io > logout Error', error);
      }
    });

    // ** 소켓 연결 해제 시
    socket.on('disconnect', async (reason) => {
      console.log(
        `Socket disconnected for ${socket.decoded.email}, by [${reason}] : ${socket.id}`
      );
      try {
        // 유저 on/offline 저장
        await userController.updateDisconnectedUser(socket.id);
        // 실시간 유저 정보 전체 발신
        const userList = await userController.listAllUsers(
          'Someone disconnected'
        );
        io.emit('users', 'Someone disconnected', userList);
        // 소켓 목록 출력
        await printAllSockets(io);
      } catch (error) {
        console.error('io > disconnect Error', error);
      }
    });
  });
};
