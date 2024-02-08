const jwt = require('jsonwebtoken');

const generateToken = async (user, type) => {
  // console.log('generateToken called', user, type);
  try {
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
  } catch (error) {
    throw new Error('토큰 생성 실패 : ', error.message);
  }
};

const verifyToken = async (token, type) => {
  // console.log('verifyToken called', token, type);
  try {
    let secretKey = '';
    if (type === 'AT') secretKey = process.env.ACCESS_SECRET_KEY;
    else if (type === 'RT') secretKey = process.env.REFRESH_SECRET_KEY;
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error('토큰 인증 실패 : ' + error.message);
  }
};

const generateTokenPair = async (user) => {
  // console.log('generateTokenPair called', user);
  try {
    const ATPromise = generateToken(user, 'AT');
    const RTPromise = generateToken(user, 'RT');
    return Promise.all([ATPromise, RTPromise]).then((tokens) => {
      return tokens;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDataFromAT = async (accessToken) => {
  // console.log('getDataFromAT called', accessToken);
  try {
    const data = verifyToken(accessToken, 'AT');
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generateTokenPair,
  getDataFromAT,
};
