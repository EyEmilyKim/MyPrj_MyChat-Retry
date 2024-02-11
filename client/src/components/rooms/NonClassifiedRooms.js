// CSS definition is in './RoomList.css';

export default function NonClassifiedRooms(props) {
  const roomList = props.roomList;
  const moveToRoom = props.moveToRoom;

  return (
    <>
      <div className="nonClassified-format">
        <div className="format-title">전체 RoomList</div>

        <div className="list-header">
          <p className="list-title">▼ 모든 룸</p>
          <p className="list-count">{roomList.length}</p>
        </div>

        {roomList.length > 0
          ? roomList.map((room) => (
              <div className="each-room" key={room._id} onClick={() => moveToRoom(room._id)}>
                <div className="room-title">{room.title}</div>
                <div className="member-count">({room.members.length}명)</div>
              </div>
            ))
          : null}
      </div>
    </>
  );
}
