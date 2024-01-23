const {
  authenticateSocket,
  connectedSockets,
  printConnectedSockets,
} = require('./io-middlewares');
const userController = require('../controllers/user.controller');

module.exports = function (io) {
  io.use(async (socket, next) => {
    await authenticateSocket(socket, next);
  });

  io.on('connection', async (socket) => {
    // console.log('socket.decoded', socket.decoded);
    // console.log(socket.handshake.query);
    console.log(
      `Socket connected for ${socket.decoded.email}, by [${socket.handshake.query.reason}] : ${socket.id}`
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
      console.log(
        `Socket disconnected for ${socket.decoded.email}, by [${reason}] : ${socket.id}`
      );
      // 소켓정보를 배열에서 제거 후 목록 출력
      const indexToRemove = connectedSockets.findIndex(
        (item) => item.sid === socket.id
      );
      if (indexToRemove !== -1) {
        connectedSockets.splice(indexToRemove, 1);
      }
      printConnectedSockets();
    });
  });
};
