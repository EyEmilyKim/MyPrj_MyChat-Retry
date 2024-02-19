import { useRef } from 'react';
import { useDataContext } from '../../contexts/DataContext';
import { createDummyRooms } from '../../utils/createDummyRooms';
import { clearAllRooms } from '../../utils/clearAllRooms';
import useScrollPosition from '../../hooks/useScrollPosition';
import useScrollToTarget from '../../hooks/useScrollToTarget';
import useStateLogger from '../../hooks/useStateLogger';
import './RoomList.css';
import RoomListIconTop from './RoomListIconTop';
import ClassifiedRooms from './ClassifiedRooms';
import NewRoom from './NewRoom';

export default function RoomList() {
  const { joinedRooms, notMyRooms } = useDataContext();

  const scrollRef = useRef();
  const { isOnTop } = useScrollPosition(scrollRef, true);
  useStateLogger(isOnTop, 'isOnTop');

  const topRef = useRef();
  const { handleScrollToTarget } = useScrollToTarget(topRef, [joinedRooms, notMyRooms], isOnTop);

  return (
    <div className="roomList-body">
      <div className="roomList-header">
        <h1 className="roomList-title">MyApp-test RoomList</h1>
        <div className="button-area">
          <button className="dummy-rooms" onClick={createDummyRooms}>
            Create Dummy
          </button>
          <button className="clear-rooms" onClick={clearAllRooms}>
            Clear Rooms
          </button>
        </div>
      </div>

      {!isOnTop ? (
        <div
          className="roomList-icon-top"
          onClick={() => {
            handleScrollToTarget();
          }}
        >
          <RoomListIconTop />
        </div>
      ) : null}

      <div className="roomList-container" ref={scrollRef}>
        <div className="topRef" ref={topRef} />
        <ClassifiedRooms joinedRooms={joinedRooms} notMyRooms={notMyRooms} />
      </div>

      <div className="newRoom-container">
        <NewRoom />
      </div>
    </div>
  );
}
