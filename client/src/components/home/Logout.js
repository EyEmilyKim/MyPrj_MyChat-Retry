import useLogout from '../../hooks/useLogout';

export default function Logout() {
  const { handleLogout } = useLogout();

  return (
    <div>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}
