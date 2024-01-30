const validateText = (value) => {
  let isValid = false; // 최종 유효성 변수
  const invalidReason = []; // 미통과 사유 배열
  // 빈 메세지 여부 검사
  let hasContent = false;
  if (value.trim() === '') {
    invalidReason.push('제공된 내용이 없습니다');
  } else {
    hasContent = true;
  }
  // 기타 유효성 검사..
  // 최종 결과 반환
  if (hasContent && 1 == 1) isValid = true;
  return { result: isValid, invalidReason: invalidReason };
};

const escapeHTML = (value) => {
  return value.replace(/[&<>"']/g, function (match) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[match];
  });
};

module.exports = {
  validateText,
  escapeHTML,
};
