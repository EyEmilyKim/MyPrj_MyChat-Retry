import axios from 'axios';

// roomList(DB) 에서 모든 룸 삭제
const clearAllRooms = () => {
  const apiRoot = process.env.REACT_APP_API_ROOT;

  axios
    .get(`${apiRoot}/room/clearRooms`)
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err))
    .finally(() => {
      if (window.confirm('페이지를 새로고침 하시겠습니까?')) {
        window.location.reload();
      }
    });
};

export { clearAllRooms };
