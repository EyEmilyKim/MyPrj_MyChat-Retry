// CSS definition is in './RoomHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function RoomHeaderIconMenu(props) {
  const toggleMenu = props.toggleMenu;

  return (
    <div>
      <FontAwesomeIcon
        icon={faEllipsisVertical}
        className="header-button menu"
        onClick={toggleMenu}
      />
    </div>
  );
}
