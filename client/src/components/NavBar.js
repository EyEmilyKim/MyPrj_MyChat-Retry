import './NavBar.css';

export default function NavBar() {
  return (
    <div className="nav-container">
      <ul className="nav-list">
        <li className="nav-items">
          <a href="/">Home</a>
        </li>
        <li className="nav-items">
          <a href="/userList">Users</a>
        </li>
        <li className="nav-items">
          <a href="/roomList">Rooms</a>
        </li>
      </ul>
    </div>
  );
}
