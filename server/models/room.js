const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Room title is required.'],
      unique: true,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      unique: true,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        unique: true,
        ref: 'User',
      },
    ],
  },
  { timestamp: true }
);

module.exports = mongoose.model('Room', roomSchema);
