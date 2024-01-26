const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const roomRoutes = require('./routes/room.routes');

// DB 연결
require('./utils/db').connect();

// CORS 미들웨어
const corsOptions = {
  origin: 'http://localhost:3000', // 클라이언트의 주소
  credentials: true, // credentials을 허용하도록 설정
};
app.use(cors(corsOptions));

// 미들웨어
app.use(express.json()); // req.body 파싱 미들웨어
app.use(cookieParser()); // req.cookies 파싱 미들웨어

// 라우터
app.use('/user', userRoutes);
app.use('/room', roomRoutes);

module.exports = app;
