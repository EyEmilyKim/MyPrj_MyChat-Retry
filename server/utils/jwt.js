const jwt = require('jsonwebtoken');

const generateToken = async (user, type) => {
  let secretKey = '';
  let expiresIn = '';
  if (type === 'AT') {
    secretKey = process.env.ACCESS_SECRET_KEY;
    expiresIn = '1h';
  } else if (type === 'RT') {
    secretKey = process.env.REFRESH_SECRET_KEY;
    expiresIn = '24h';
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    secretKey,
    {
      expiresIn: expiresIn,
      issuer: 'MyApp-Test',
    }
  );
  return token;
};

function verifyToken(token, type) {
  // console.log('verifyToken called', token);
  let secretKey = '';
  if (type === 'AT') secretKey = process.env.ACCESS_SECRET_KEY;
  else if (type === 'RT') secretKey = process.env.REFRESH_SECRET_KEY;

  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(new Error('토큰 인증 실패 : ' + err.message));
      } else {
        resolve(decoded);
      }
    });
  });
}

module.exports = {
  generateToken,
  verifyToken,
};
