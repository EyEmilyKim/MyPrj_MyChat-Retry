const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: [true, 'Email address is required.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  name: {
    type: String,
    unique: true,
  },
  token: {
    type: String,
  },
  sid: {
    type: String,
  },
  online: {
    type: Boolean,
  }
});

module.exports = mongoose.model('User', userSchema);