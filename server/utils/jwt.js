const jwt = require('jsonwebtoken');

const generateToken = async (user, type) => {
  let secretKey = '';
  let expiresIn = '';
  if (type === 'AT') {
    secretKey = process.env.ACCESS_SECRET_KEY;
    expiresIn = process.env.ACCESS_EXPIRES_IN;
  } else if (type === 'RT') {
    secretKey = process.env.REFRESH_SECRET_KEY;
    expiresIn = process.env.REFRESH_EXPIRES_IN;
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    secretKey,
    {
      expiresIn: expiresIn,
      issuer: process.env.TOKEN_ISSUER,
    }
  );
  return token;
};

function verifyToken(token, type) {
  // console.log('verifyToken called', token);
  let secretKey = '';
  if (type === 'AT') secretKey = process.env.ACCESS_SECRET_KEY;
  else if (type === 'RT') secretKey = process.env.REFRESH_SECRET_KEY;
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error('토큰 인증 실패 : ' + error.message);
  }
}

function getDataFromAT(accessToken) {
  // console.log('getDataFromAT called', accessToken);
  try {
    const data = this.verifyToken(accessToken, 'AT');
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  generateToken,
  verifyToken,
  getDataFromAT,
};
