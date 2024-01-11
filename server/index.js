const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // 클라이언트의 주소
  credentials: true, // credentials을 허용하도록 설정
};

app.use(cors(corsOptions));

app.post('/login', (req, res) => {
  res.json({ msg: 'This is CORS-enabled for all origins!' });
});

app.listen(1234, () => {
  console.log('CORS-enabled web server listening on port 1234....');
});
