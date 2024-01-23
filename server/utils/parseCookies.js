// 쿠키 파싱 함수
async function parseCookies(cookieHeader) {
  const cookies = {};
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    cookies[parts[0].trim()] = parts[1].trim();
  });
  return cookies;
}

module.exports = {
  parseCookies,
};
