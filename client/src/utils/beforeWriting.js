const validation = (value, valueName) => {
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
  // 최종 유효성 결과
  if (hasContent && 1 == 1) isValid = true;
  // ** 미통과 시 사유 출력 후 return false
  if (!isValid) {
    console.log(`Invalid ${valueName} :\n${invalidReason.join('\n')}`);
    alert(`Invalid ${valueName} :\n${invalidReason.join('\n')}`);
    return false;
  }
  return true;
};

// const escapeHTML = (value, valueName) => {
//   const escapedValue = value.replace(/[&<>"']/g, function (match) {
//     return {
//       '&': '&amp;',
//       '<': '&lt;',
//       '>': '&gt;',
//       '"': '&quot;',
//       "'": '&#39;',
//     }[match];
//   });
//   console.log(`escaped ${valueName} : ${escapedValue}`);
//   return escapedValue;
// };

module.exports = {
  validation,
};
