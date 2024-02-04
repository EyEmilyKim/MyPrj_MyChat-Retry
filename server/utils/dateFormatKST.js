// Date 객체를 KST로 변경, 포맷팅
const dateFormatKST = async () => {
  // UST 날짜 객체
  let ustDate = new Date();
  // console.log('ustDate :', ustDate); // 초기값 : 2024-02-04T13:03:38.575Z

  // KST로 변환
  let kstDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short', // short - (일) / long - (일요일)
    hour12: true, // true - 오후 10:03 / false - 22:03
    timeZone: 'Asia/Seoul',
  }).format(ustDate);

  // 공백을 없애고 원하는 구분자를 추가
  kstDateFormatted = kstDate
    .replace(/\s/g, '')
    // .replace(/\./g, '')
    .replace(/\.\(/g, '(')
    .replace(/\)/g, ') ');
  // .replace(/오후|오전/g, '');

  // console.log('kstDate :', kstDate); //kstDate : 2024. 02. 04. (일) 오후 10:03
  // console.log('kstDateFormatted :', kstDateFormatted); //결과값 : 2024.02.04(일)오후10:03오후10:03

  return kstDateFormatted;
};

module.exports = {
  dateFormatKST,
};
