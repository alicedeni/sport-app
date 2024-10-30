import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CButtonProfile } from "../Buttons";

const MobileHeader = ({ avatar, userName, points }) => {
  const { id } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <div className="mobile-header">
      <div className="mobile-header__title">
        <span>СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ</span>
        <CButtonProfile points={points}>
          {avatar ? (
            <img src={avatar} alt="User Avatar" className="avatar" />
          ) : (
            <div>{userName ? userName.charAt(0) : ''}</div>
          )}
        </CButtonProfile>
      </div>
      <button className="mobile-header__toggle" onClick={toggleMenu}>
        <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
      </button>
      {isMenuOpen && (
        <nav className="mobile-header__nav">
          <ul className="mobile-header__nav-list">
            <li>
              <Link to={`/main/${id}`} className="mobile-header__nav-list-item">ЛЕНТА</Link>
            </li>
            <li>
              <Link to={`/challenges/${id}`} className="mobile-header__nav-list-item">ЧЕЛЛЕНДЖИ</Link>
            </li>
            <li>
              <Link to={`/ratings/${id}`} className="mobile-header__nav-list-item">РЕЙТИНГИ</Link>
            </li>
            <li>
              <Link to={`/activity/${id}`} className="mobile-header__nav-list-item">АКТИВНОСТЬ</Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MobileHeader;