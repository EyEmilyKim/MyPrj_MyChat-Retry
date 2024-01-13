const bcrypt = require('bcrypt');

// 비밀번호 해싱
async function hashPassword(pw) {
  const password = pw;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// 비밀번호 비교
async function comparePassword(pw, hashedPw) {
  return await bcrypt.compare(pw, hashedPw);
}

module.exports = { hashPassword, comparePassword };
