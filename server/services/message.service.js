const Message = require('../models/message');
const { dateFormatKST } = require('../utils/dateFormatKST');
const messageService = {};

// 메세지 저장
messageService.saveMessage = async function (msg, user, room) {
  // console.log('messageService.saveMessage called');
  try {
    const now = await dateFormatKST();
    const newMsg = new Message({
      room: room._id,
      sender: user._id,
      content: msg,
      timestamp: now,
    });
    await newMsg.save();
    // console.log('newMsg', newMsg);
    return newMsg;
  } catch (error) {
    // console.log('messageService.saveMessage error : ', error);
    throw new Error(error.message);
  }
};

module.exports = messageService;
