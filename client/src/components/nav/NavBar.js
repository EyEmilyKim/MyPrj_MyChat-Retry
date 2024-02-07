import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useToggleState from '../../hooks/useToggleState';
import useOutsideClick from '../../hooks/useOutsideClick';
import './NavBar.css';
import NavUser from './NavUser';
import NavUserMenu from './NavUserMenu';

export default function NavBar() {
  const [isMenuOpen, toggleMenu, setMenu] = useToggleState(false);

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

  const clickRef = useRef();
  useOutsideClick(clickRef, () => {
    setMenu(false);
  });

  return (
    <div className="nav-container">
      <div className="nav-upper">
        <div ref={clickRef}>
          <NavUser toggleMenu={toggleMenu} />
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

      <div className="nav-lower">
        {isMenuOpen ? <NavUserMenu toggleMenu={toggleMenu} /> : null}
      </div>
    </div>
  );
}
