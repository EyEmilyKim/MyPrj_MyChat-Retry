const { authenticateSocket } = require('./io-middlewares');
const { printAllSockets, emitUsers, emitRooms } = require('./io-functions');
const userController = require('../controllers/user.controller');
const userService = require('../services/user.Service');
const roomController = require('../controllers/room.controller');
const messageController = require('../controllers/message.controller');

module.exports = function (io) {
  io.use(async (socket, next) => {
    await authenticateSocket(socket, next);
  }); // JWT 인증 미들웨어

  io.on('connection', async (socket) => {
    const socketEmail = socket.decoded.email;
    const connectReason = socket.handshake.query.reason;
    const socketId = socket.id;
    // ** 소켓 연결 시
    console.log(`Socket connected ${socketEmail}, by [${connectReason}] : ${socketId}`);
    try {
      await printAllSockets(io); // 소켓 목록 출력
      await userController.updateConnectedUser(socketEmail, socketId); // 유저 on/offline 저장
      emitUsers(io, 'Someone connected'); // 실시간 유저 정보 발신
    } catch (error) {
      console.error('io > connection Error', error);
    }

    // ** 유저 목록 요청
    socket.on('getUsers', async (cb) => {
      console.log(`'getUsers' called by : `, socketEmail);
      try {
        const userList = await userController.listAllUsers('UserList loaded');
        cb({ status: 'ok', data: userList });
      } catch (error) {
        console.error('io > getUsers Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 유저 정보 수정
    socket.on('updateUser', async (name, description, cb) => {
      console.log(`'updateUser' called by : `, socketEmail);
      try {
        const user = await userController.updateUser(socketId, name, description); // 유저 정보 수정
        emitUsers(io, 'Someone updated'); // 실시간 유저 정보 발신
        cb({ status: 'ok', data: user });
      } catch (error) {
        console.error('io > updateUser Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 룸 목록 요청
    socket.on('getRooms', async (cb) => {
      console.log(`'getRooms' called by : `, socketEmail);
      try {
        const roomList = await roomController.getAllRooms('RoomList loaded');
        cb({ status: 'ok', data: roomList });
      } catch (error) {
        console.log('io > getRooms Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 룸 생성
    socket.on('createRoom', async (title, cb) => {
      console.log(`'createRoom' called by : ${socketEmail}, ${title}`);
      try {
        const result = await roomController.createRoom(title, socketId); // 룸 만들기
        if (result.providingError) {
          // 클라이언트에게 제공할 에러 있는 경우
          cb({ status: 'not ok', data: result.providingError });
        } else {
          emitRooms(io, 'Someone created a room'); // 실시간 룸 정보 발신
          cb({ status: 'ok', data: { room: result.room } });
        }
      } catch (error) {
        console.log('io > createRoom Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 룸 입장 시
    socket.on('joinRoom', async (rid, cb) => {
      console.log(`'joinRoom' called by :`, socketEmail, rid);
      try {
        let user = await userService.checkUser(socketId, 'sid'); // 유저정보 찾기
        const result = await roomController.joinRoom(rid, user); // update Room
        // 해당 룸채널 조인
        const ridToString = rid.toString();
        socket.join(ridToString);
        // 첫 입장 시
        if (result.updateMessage) {
          // update User
          user = await userController.joinRoom(user, result.populatedRoom);
          // 룸채널에 메세지, 룸 정보 발신
          io.to(ridToString).emit('message', result.updateMessage);
          io.to(ridToString).emit('updatedRoom', result.populatedRoom);
          // 실시간 룸 정보 발신
          emitRooms(io, 'Someone joined somewhere');
        }
        cb({ status: 'ok', data: { room: result.populatedRoom, user: user } });
      } catch (error) {
        console.log('io > joinRoom Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 룸 퇴장 시
    socket.on('leaveRoom', async (rid, cb) => {
      console.log(`'leaveRoom' called by :`, socketEmail, rid);
      try {
        const user = await userService.checkUser(socketId, 'sid'); // 유저정보 찾기
        const result = await roomController.leaveRoom(rid, user); // update Room
        const updatedRoom = result.populatedRoom;
        let updatedUser = user;
        // 해당 룸채널 탈퇴
        const ridToString = rid.toString();
        socket.leave(ridToString);
        // 퇴장 시
        if (result.updateMessage) {
          // update User
          updatedUser = await userController.leaveRoom(user, updatedRoom);
          // 룸채널에 메세지, 룸 정보 발신
          io.to(ridToString).emit('message', result.updateMessage);
          io.to(ridToString).emit('updatedRoom', updatedRoom);
          // 실시간 룸 정보 발신
          emitRooms(io, 'Someone left somewhere');
        }
        cb({ status: 'ok', data: { room: updatedRoom, user: updatedUser } });
      } catch (error) {
        console.log('io > leaveRoom Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 메세지 수신 시
    socket.on('sendMessage', async (msg, rid, cb) => {
      console.log(`'sendMessage' called by : ${socketEmail}, ${msg}, ${rid}`);
      try {
        const message = await messageController.saveMessage(msg, socketId, rid);
        io.to(rid).emit('message', message);
        cb({ status: 'ok' });
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
      console.log(`Socket disconnected ${socketEmail}, by [${reason}] : ${socketId}`);
      try {
        await userController.updateDisconnectedUser(socketId); // 유저 on/offline 저장
        emitUsers(io, 'Someone disconnected'); // 실시간 유저 정보 발신
        await printAllSockets(io); // 소켓 목록 출력
      } catch (error) {
        console.error('io > disconnect Error', error);
      }
    });
  });
};
