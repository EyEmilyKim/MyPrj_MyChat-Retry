import { Link } from 'react-router-dom';
import './NavBar.css';
import NavUser from './NavUser';

export default function NavBar() {
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
      <NavUser />

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
