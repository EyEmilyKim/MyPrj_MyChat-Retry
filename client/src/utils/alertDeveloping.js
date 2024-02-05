// 아직 개발중임을 안내하는 함수
const alertDeveloping = (temporalName = '') => {
  console.log(`${temporalName} called`);
  alert('기능 준비중입니다...');
};

module.exports = { alertDeveloping };
