export default function ClassifiedRooms(props) {
  const joinedRooms = props.joinedRooms;
  const notMyRooms = props.notMyRooms;
  const moveToRoom = props.moveToRoom;

  return (
    <>
      <div className="classified-format">
        <div className="format-title">분류된 RoomList</div>

        <div className="list-header">
          <p className="list-title">▼ 소속된 룸</p>
          <p className="list-count">{joinedRooms.length}</p>
        </div>

        {joinedRooms.length > 0
          ? joinedRooms.map((room) => (
              <div
                className="each-room"
                key={room._id}
                onClick={() => moveToRoom(room._id)}
              >
                <div className="room-title">{room.title}</div>
                <div className="member-count">({room.members.length}명)</div>
              </div>
            ))
          : null}
        <div className="list-header">
          <p className="list-title">▼ 전체 룸</p>
          <p className="list-count">{notMyRooms.length}</p>
        </div>
        {notMyRooms.length > 0
          ? notMyRooms.map((room) => (
              <div
                className="each-room"
                key={room._id}
                onClick={() => moveToRoom(room._id)}
              >
                <div className="room-title">{room.title}</div>
                <div className="member-count">({room.members.length}명)</div>
              </div>
            ))
          : null}
      </div>
    </>
  );
}
