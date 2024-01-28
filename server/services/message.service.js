const Message = require('../models/message');
const messageService = {};

// 메세지 저장
messageService.saveMessage = async function (message, user, room) {
  console.log('messageService.saveMessage called');
  try {
    const newMsg = new Message({
      room: room._id,
      sender: user._id,
      content: message,
    });
    await newMsg.save();
    // console.log('newMsg', newMsg);
    return newMsg;
  } catch (error) {
    console.log('messageService.saveMessage error : ', error);
    throw new Error(error.message);
  }
};

module.exports = messageService;
