import { useNavigate } from 'react-router-dom';
import useJoinedRoomsNotification from '../../hooks/useJoinedRoomsNotification';
import './ClassifiedRooms.css';

export default function ClassifiedRooms({ joinedRooms, notMyRooms }) {
  const { getNotificationCount, resetNotificationCount } = useJoinedRoomsNotification(joinedRooms);

  const navigate = useNavigate();
  const moveToRoom = async (rid) => {
    await resetNotificationCount(rid);
    navigate(`/room/${rid}`);
  };

  return (
    <>
      <div className="classifiedRoom-body">
        <div className="format-title">분류된 RoomList</div>

        <div className="list-header">
          <p className="list-title">▼ 소속된 룸</p>
          <p className="list-count">{joinedRooms.length}</p>
        </div>

        {joinedRooms.length > 0
          ? joinedRooms.map((room) => (
              <div className="each-room" key={room._id} onClick={() => moveToRoom(room._id)}>
                <div className="each-room-child">
                  <div className="room-title">{room.title}</div>
                  <div className="member-count">({room.members.length}명)</div>
                </div>
                <div className="each-room-child">
                  {getNotificationCount(room._id) > 0 ? (
                    <div className="notification-count">{getNotificationCount(room._id)}</div>
                  ) : null}
                </div>
              </div>
            ))
          : null}

        <div className="list-header">
          <p className="list-title">▼ 전체 룸</p>
          <p className="list-count">{notMyRooms.length}</p>
        </div>

        {notMyRooms.length > 0
          ? notMyRooms.map((room) => (
              <div className="each-room" key={room._id} onClick={() => moveToRoom(room._id)}>
                <div className="each-room-child">
                  <div className="room-title">{room.title}</div>
                  <div className="member-count">({room.members.length}명)</div>
                </div>
              </div>
            ))
          : null}
      </div>
    </>
  );
}
