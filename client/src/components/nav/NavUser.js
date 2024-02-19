import { useLoginContext } from '../../contexts/LoginContext';
import './NavUser.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default function NavUser(props) {
  const toggleMenu = props.toggleMenu;
  const { isLogin, user } = useLoginContext();

  return (
    <div className="nav-user" onClick={toggleMenu}>
      {isLogin ? (
        <>
          <img src="/profile.jpeg" alt="user-profile-image" className="profile-image" />
          <p className="user-name">{user.name}</p>
        </>
      ) : (
        <FontAwesomeIcon icon={faLock} className="lock-image" />
      )}
    </div>
  );
}
