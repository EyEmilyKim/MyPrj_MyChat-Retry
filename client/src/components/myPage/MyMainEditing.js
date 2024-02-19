import { useState } from 'react';
import { useLoginContext } from '../../contexts/LoginContext';
import { useSocketContext } from '../../contexts/SocketContext';
// CSS definition is in MyPage.css
import MyProfileEditing from './MyProfileEditing';
import MyFeatSave from './MyFeatSave';
import MyFeatCancel from './MyFeatCancel';

export default function MyMainEditing(props) {
  const toggleEditing = props.toggleEditing;
  const { user, setUser } = useLoginContext();
  const { socket } = useSocketContext();
  const [name, setName] = useState(user.name);
  const [description, setDescription] = useState(user.description);

  const handleSaveUser = () => {
    console.log(`handleSaveUser called : ${name}, ${description}`);
    // 소켓 발신
    socket.emit('updateUser', name, description, (res) => {
      console.log(`'updateUser' res : `, res);
      setUser(res.data);
      toggleEditing();
    });
  };

  const propsForProfEdit = {
    name,
    setName,
    description,
    setDescription,
  };

  return (
    <>
      <MyProfileEditing {...propsForProfEdit} />

      <div className="myPage-feats">
        <MyFeatSave handleSaveUser={handleSaveUser} />
        <MyFeatCancel toggleEditing={toggleEditing} />
      </div>
    </>
  );
}
