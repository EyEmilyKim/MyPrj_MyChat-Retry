import { useContext } from 'react';
import './NavBar.css';
import { LoginContext } from '../contexts/LoginContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default function NavBar() {
  const { isLogin, user } = useContext(LoginContext);

  const navItems = [
    {
      href: '/',
      text: 'Home',
    },
    {
      href: '/userList',
      text: 'Users',
    },
    {
      href: '/roomList',
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
              <a href={item.href}>{item.text}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
