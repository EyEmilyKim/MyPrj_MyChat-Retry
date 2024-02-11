import axios from 'axios';

// roomList(DB) 에 dummy 룸 추가
const createDummyRooms = () => {
  const apiRoot = process.env.REACT_APP_API_ROOT;

  axios
    .get(`${apiRoot}/room/createDummy`)
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err))
    .finally(() => {
      if (window.confirm('페이지를 새로고침 하시겠습니까?')) {
        window.location.reload();
      }
    });
};

export { createDummyRooms };
