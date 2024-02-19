import { useDataContext } from '../../contexts/DataContext';
import './UserList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';

export default function UserList() {
  const { userList } = useDataContext();

  const refreshThis = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="userList-header">
        <h1 className="userList-title">MyApp-test UserList</h1>
        <div className="refresh-button" onClick={refreshThis}>
          <FontAwesomeIcon icon={faArrowRotateRight} />
        </div>
      </div>

      <div className="userList-body">
        {userList.length > 0
          ? userList.map((user) => (
              <div className="each-user" key={user._id}>
                <div className="user-name">{user.name}</div>
                <div className={`user-online ${user.online ? 'online' : 'offline'}`}>
                  {user.online ? '●' : '●'}
                </div>
              </div>
            ))
          : null}
      </div>
    </>
  );
}
