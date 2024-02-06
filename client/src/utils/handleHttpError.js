// 에러 메시지 처리하는 함수
const handleHttpError = async (error, notify) => {
  if (error.response) {
    //응답코드 2xx 가 아닌 경우
    console.log('Error response:', error.response.data);
    if (notify) alert(error.response.data.error);
  } else if (error.request) {
    //요청이 전혀 이루어지지 않은 경우
    console.log('Error request:', error.request);
  } else {
    //예상치 못한 에러
    console.log('Error:', error);
    alert(error);
  }
};

export { handleHttpError };
