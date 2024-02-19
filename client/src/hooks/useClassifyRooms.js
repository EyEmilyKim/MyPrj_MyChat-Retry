import { useState } from 'react';
import { useLoginContext } from '../contexts/LoginContext';

export default function useClassifyRooms() {
  const { user } = useLoginContext();
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [notMyRooms, setNotMyRooms] = useState([]);

  const classifyRooms = async (roomList) => {
    let joinedRooms = [];
    let notMyRooms = [];
    for (const room of roomList) {
      if (room.members.some((memberId) => memberId === user._id)) {
        joinedRooms.push(room);
      } else {
        notMyRooms.push(room);
      }
    }
    // console.log(`classifyRooms joinedRooms : `, joinedRooms);
    // console.log(`classifyRooms notMyRooms : `, notMyRooms);
    setJoinedRooms(joinedRooms);
    setNotMyRooms(notMyRooms);
  };

  return {
    joinedRooms,
    notMyRooms,
    classifyRooms,
  };
}
