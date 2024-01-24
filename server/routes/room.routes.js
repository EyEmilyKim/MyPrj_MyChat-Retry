const express = require('express');
const router = express.Router();

router.get('/createDummy', (req, res) => {
  // 임의로 룸 만들어주기
  const Room = require('../models/room');
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
    .then(
      () => res.status(200).json({ message: 'createDummy 성공 !' })
      // .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    )
    .catch((error) =>
      res.status(500).json({ message: 'createDummy 실패...', error: error })
    );
});

module.exports = router;
