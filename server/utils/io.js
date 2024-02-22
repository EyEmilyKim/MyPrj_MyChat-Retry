const { authenticateSocket } = require('./io-middlewares');
const { printAllSockets, emitUsers, emitRooms } = require('./io-functions');
const userController = require('../controllers/user.controller');
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
        const userList = await userController.listAllUsersExtracted('UserList loaded');
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

    // ** 룸 입장
    socket.on('joinRoom', async (rid, cb) => {
      console.log(`'joinRoom' called by :`, socketEmail, rid);
      try {
        const result = await roomController.joinRoom(rid, socketId); // update Room
        // 해당 룸채널 조인
        socket.join(rid);
        // 첫 입장 시
        if (result.memberUpdate) {
          io.to(rid).emit('updatedRoom', result.populatedRoom); // 룸채널에 룸 정보 발신
          emitRooms(io, 'Someone joined somewhere'); // 실시간 룸 정보 발신
        }
        cb({
          status: 'ok',
          data: { room: result.populatedRoom, user: result.user, roomIndex: result.roomIndex },
        });
      } catch (error) {
        console.log('io > joinRoom Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 룸 퇴장
    socket.on('leaveRoom', async (rid, cb) => {
      console.log(`'leaveRoom' called by :`, socketEmail, rid);
      try {
        const result = await roomController.leaveRoom(rid, socketId); // update Room
        socket.leave(rid); // 해당 룸채널 탈퇴

        if (result.roomDeleted) {
          // 마지막 멤버 퇴장, 룸 삭제 시
          emitRooms(io, 'Someone left and a room has been deleted'); // 실시간 룸 정보 발신
          cb({ status: 'ok', data: { roomDeleted: result.roomDeleted, user: result.user } });
        }

        // 룸 남아있을 경우
        io.to(rid).emit('updatedRoom', result.populatedRoom); // 룸채널에 룸 정보 발신
        emitRooms(io, 'Someone left somewhere'); // 실시간 룸 정보 발신
        cb({ status: 'ok', data: { room: result.populatedRoom, user: result.user } });
      } catch (error) {
        console.log('io > leaveRoom Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 룸 오너 변경
    socket.on('changeOwner', async (rid, newOwnerId, cb) => {
      console.log(`'changeOwner' called by :`, socketEmail, rid, newOwnerId);
      try {
        const room = await roomController.changeOwner(rid, newOwnerId, socketId); // update Room
        io.to(rid).emit('updatedRoom', room); // 룸채널에 룸 정보 발신
        cb({ status: 'ok', data: room });
      } catch (error) {
        console.log('io > changeOwner Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 기존 메세지 요청
    socket.on('getMessages', async (rid, joinIndex, cb) => {
      console.log(`'getMessages' called by : ${socketEmail}, ${rid}, ${joinIndex}`);
      try {
        const lastReadIndex = await userController.getLastReadIndex(socketId, rid);
        const messageList = await messageController.getAllMessagesSince(rid, joinIndex);
        cb({ status: 'ok', data: messageList, lastReadIndex });
      } catch (error) {
        console.log('io > getMessages Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** lastReadIndex 수신
    socket.on('sendLastReadIndex', async (rid, lastReadIndex, cb) => {
      console.log(`'sendLastReadIndex' called by : ${socketEmail}, ${rid}, ${lastReadIndex}`);
      try {
        const user = await userController.saveLastReadeIndex(socketId, rid, lastReadIndex);
        cb({ status: 'ok', data: user.roomIndexes });
      } catch (error) {
        console.log('io > sendLastReadIndex Error', error);
        cb({ status: 'Server side Error' });
      }
    });

    // ** 메세지 수신
    socket.on('sendMessage', async (msg, rid, cb) => {
      console.log(`'sendMessage' called by : ${socketEmail}, ${msg}, ${rid}`);
      try {
        const message = await messageController.saveMessage(msg, socketId, rid);
        io.emit(`message-${rid}`, message);
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
