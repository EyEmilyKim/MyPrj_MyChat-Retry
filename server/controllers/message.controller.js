const messageService = require('../services/message.service');
const roomService = require('../services/room.service');
const userService = require('../services/user.Service');

const messageController = {};

// 메세지 저장
messageController.saveMessage = async function (msg, socketId, rid) {
  console.log('messageController.saveMessage called');
  try {
    // 유저, 룸 정보 찾기
    const user = await userService.checkUser(socketId, 'sid');
    const room = await roomService.checkRoom(rid, '_id');
    if (user && room) {
      // 메세지 저장
      const newMsg = await messageService.saveMessage(msg, user, room);
      // 해당 룸에 메세지(sender 정보 채워서) 보냄
      const populatedMsg = await newMsg.populate('sender', ['email', 'name']);
      // console.log('populatedMsg', populatedMsg);
      return populatedMsg;
    } else {
      throw new Error('room 또는 user 정보를 찾을 수 없습니다');
    }
  } catch (error) {
    console.log('messageController.saveMessage error : ', error);
    throw new Error(error.message);
  }
};

module.exports = messageController;
