import { Link } from 'react-router-dom';
import useToggleMenu from '../../hooks/useToggleMenu';
import './NavBar.css';
import NavUser from './NavUser';
import NavUserMenu from './NavUserMenu';

export default function NavBar() {
  const { isMenuOpen, toggleMenu } = useToggleMenu(true);

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
      <div className="nav-upper">
        <NavUser toggleMenu={toggleMenu} />

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

      <div className="nav-lower">
        {isMenuOpen ? <NavUserMenu toggleMenu={toggleMenu} /> : null}
      </div>
    </div>
  );
}
