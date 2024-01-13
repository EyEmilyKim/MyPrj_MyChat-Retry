const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

// DB 연결
const mongoose = require('mongoose');
mongoose
  .connect(process.env.DB)
  .then(() => console.log('몽고DB에 연결되었습니다!'))
  .catch((err) => console.log('몽고DB 연결 실패 : ', err));

// CORS 미들웨어
const corsOptions = {
  origin: 'http://localhost:3000', // 클라이언트의 주소
  credentials: true, // credentials을 허용하도록 설정
};
app.use(cors(corsOptions));

// 미들웨어
app.use(express.json()); // req.body 파싱 미들웨어

// 라우터
app.use('/user', userRoutes);

module.exports = app;
