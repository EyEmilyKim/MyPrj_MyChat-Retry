const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Room title is required.'],
      unique: true,
    },
    created: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamp: true }
);

module.exports = mongoose.model('Room', roomSchema);
