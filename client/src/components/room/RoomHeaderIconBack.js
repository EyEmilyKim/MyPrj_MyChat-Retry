import { useNavigate } from 'react-router-dom';
// CSS definition is in './RoomHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

export default function RoomHeaderIconBack(props) {
  const roomTitle = props.roomTitle;

  const navigate = useNavigate();
  const handleBack = () => {
    console.log(`handleBack called`);
    navigate(`/roomList`);
    console.log(`successfully back from "${roomTitle}"`);
  };

  return <FontAwesomeIcon icon={faAngleLeft} className="header-button back" onClick={handleBack} />;
}
