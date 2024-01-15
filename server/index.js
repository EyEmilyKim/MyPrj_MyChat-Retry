const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');
require('dotenv').config();
const cors = require('cors');

const httpServer = http.createServer(app);
const ioServer = require('./utils/io')(
  socketIO(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  })
);

httpServer.listen(process.env.PORT, () => {
  console.log(
    `CORS-enabled web server listening on port ${process.env.PORT}...`
  );
});
