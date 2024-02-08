const roomController = require('../controllers/room.controller');
const userController = require('../controllers/user.controller');

// 연결된 모든 소켓 출력
async function printAllSockets(io) {
  const allSockets = io.sockets.sockets;
  // console.log('allSockets', allSockets);
  console.log('-------- All connected sockets --------');
  for (const [socketId, socket] of allSockets) {
    console.log(`${socket.decoded.email} - ${socket.id}, Connected: ${socket.connected}`);
  }
  console.log('----------------------------------------');
}

// 실시간 유저 정보 전체 발신
async function emitUsers(io, reason) {
  // console.log('emitUsers called', reason);
  const userList = await userController.listAllUsersExtracted(reason);
  io.emit('users', reason, userList);
}

// 실시간 룸 정보 전체 발신
async function emitRooms(io, reason) {
  // console.log('emitRooms called', reason);
  const roomList = await roomController.getAllRooms(reason);
  io.emit('rooms', reason, roomList);
}

module.exports = {
  printAllSockets,
  emitUsers,
  emitRooms,
};
