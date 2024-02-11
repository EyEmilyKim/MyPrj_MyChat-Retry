import { useContext, useState } from 'react';
import { LoginContext } from '../contexts/LoginContext';

export default function useClassifyRooms() {
  const { user } = useContext(LoginContext);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [notMyRooms, setNotMyRooms] = useState([]);

  const classifyRooms = async (roomList) => {
    let joinedRooms = [];
    let notMyRooms = [];
    await roomList.map((room) => {
      if (room.members.some((memberId) => memberId === user._id)) {
        joinedRooms.push(room);
      } else {
        notMyRooms.push(room);
      }
    });
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
