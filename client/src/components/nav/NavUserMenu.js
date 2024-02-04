import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContext';
import useLogout from '../../hooks/useLogout';
import './NavUserMenu.css';

export default function NavUserMenu() {
  const { isLogin } = useContext(LoginContext);
  const { handleLogout } = useLogout();

  const navigate = useNavigate();
  const moveToMyPage = () => {
    // console.log('moveToMyPage called');
    navigate('/myPage');
  };

  return (
    <div className="navUserMenu">
      <ul className="navUserMenu-list">
        {isLogin ? (
          <>
            <li className="navUserMenu-items" key={101}>
              <label onClick={moveToMyPage}>마이페이지</label>
            </li>
            <li className="navUserMenu-items" key={102}>
              <label onClick={handleLogout}>로그아웃</label>
            </li>
          </>
        ) : (
          <>
            {/* <li className="navUserMenu-items" key={1}>
              <p>로그인</p>
            </li> */}
          </>
        )}
      </ul>
    </div>
  );
}
