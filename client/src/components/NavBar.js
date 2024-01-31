import { useContext } from 'react';
import './NavBar.css';
import { LoginContext } from '../contexts/LoginContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const { isLogin, user } = useContext(LoginContext);

  const navItems = [
    {
      to: '/',
      text: 'Home',
    },
    {
      to: '/userList',
      text: 'Users',
    },
    {
      to: '/roomList',
      text: 'Rooms',
    },
  ];

  return (
    <div className="nav-container">
      <div className="nav-user">
        {isLogin ? (
          <>
            <img
              src="/profile.jpeg"
              alt="user-profile-image"
              className="profile-image"
            />
            <p className="user-name">{user.name}</p>
          </>
        ) : (
          <FontAwesomeIcon icon={faLock} className="lock-image" />
        )}
      </div>

      <ul className="nav-list">
        {navItems.map((item) => {
          return (
            <li className="nav-items" key={item.text}>
              <Link to={item.to}>{item.text}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
