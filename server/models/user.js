const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    unique: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, '유효한 이메일 형식이 아닙니다.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  name: {
    type: String,
  },
  created: {
    type: String,
  },
  resigned: {
    type: String,
  },
  token: {
    type: String,
  },
  sid: {
    type: String,
  },
  online: {
    type: Boolean,
  },
  roomIndexes: [
    {
      room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
      },
      joinIndex: {
        type: Number,
      },
      lastReadIndex: {
        type: Number,
      },
    },
  ],
  description: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('User', userSchema);
