const mongoose = require('mongoose');

// DB 연결
const connect = async function () {
  mongoose
    .connect(process.env.DB)
    .then(() => console.log('몽고DB에 연결되었습니다!'))
    .catch((err) => console.log('몽고DB 연결 실패 : ', err));
};

// 전달받은 객체가 Mongoose Document 객체인지 확인
const isInstance = async function (object, paramDescription) {
  const isMongooseDoc = object instanceof mongoose.Document; // true/false
  console.log(`${paramDescription} is a mongoose instance : ${isMongooseDoc}`);
};

module.exports = { connect, isInstance };
