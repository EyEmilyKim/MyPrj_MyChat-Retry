const express = require('express');
const router = express.Router();

const Room = require('../models/room');
const mongoose = require('mongoose');

router.get('/createDummy', (req, res) => {
  // 임의로 룸 만들어주기
  Room.insertMany([
    {
      title: '*자바스크립트 단톡방',
    },
    {
      title: '*리액트 단톡방',
    },
    {
      title: '*NodeJS 단톡방',
    },
  ])
    .then(() => {
      console.log('createDummy success');
      res.status(200).json({ message: 'createDummy 성공 !' });
    })
    .catch((error) => {
      console.log('createDummy error', error);
      res.status(500).json({ message: 'createDummy 실패...', error: error });
    });
});

router.get('/clearRooms', (req, res) => {
  // 전체 룸 삭제
  const Rooms = mongoose.connection.collections['rooms'];
  Rooms.drop((error) => {
    if (error) {
      console.error('clearRooms error', error);
      res.status(500).json({ message: 'clearRooms 실패...', error: error });
    } else {
      console.log('clearRooms success');
      // mongoose.connection.close();
      res.status(200).json({ message: 'clearRooms 성공 !' });
    }
  });
});

module.exports = router;
