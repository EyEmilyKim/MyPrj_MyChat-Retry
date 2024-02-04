import React, { useContext } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
import './NavUserMenu.css';

export default function NavUserMenu() {
  const { isLogin } = useContext(LoginContext);

  return (
    <div className="navUserMenu">
      <ul className="navUserMenu-list">
        {isLogin ? (
          <>
            <li className="navUserMenu-items" key={101}>
              <p>마이페이지</p>
            </li>
            <li className="navUserMenu-items" key={102}>
              <p>로그아웃</p>
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
