const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: true,
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
    default: -1,
  },
});

MessageSchema.pre('save', async function (next) {
  // index 값 자동 생성(auto increase)
  if (!this.index || this.index < 0) {
    const latestMessage = await this.constructor
      .findOne({ room: this.room })
      .sort('-index');
    this.index = (latestMessage ? latestMessage.index : 0) + 1;
  }
  next();
});

module.exports = mongoose.model('Message', MessageSchema);
