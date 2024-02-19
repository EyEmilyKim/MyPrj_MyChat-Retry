import { useLoginContext } from '../../contexts/LoginContext';
import './HomePage.css';
import Loader from '../../components-util/Loader';
import Login from './Login';
import Logout from './Logout';

export default function HomePage() {
  const { loginOperating, isAuthing, isLogin, user } = useLoginContext();

  return (
    <div className="home-body">
      <h1 className="home-title">MyApp-test HomePage</h1>

      {loginOperating || isAuthing ? (
        <Loader />
      ) : !isLogin ? (
        <div className="nonLoggedIn-area">
          <Login />
        </div>
      ) : (
        <div className="loggedIn-area">
          <p className="welcome-userName">반갑습니다 {user.name || user.email}님~~ !</p>
          <Logout />
        </div>
      )}
    </div>
  );
}
