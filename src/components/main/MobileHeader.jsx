import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const MobileHeader = ({ avatar, userName, points }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState)
  }

  return (
    <div className="mobile-header">
      <div className="mobile-header__title">
        <span>СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ</span>
      </div>
      <button className="mobile-header__toggle" onClick={toggleMenu}>
        <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
      </button>
      {isMenuOpen && (
        <nav className="mobile-header__nav">
          <ul className="mobile-header__nav-list">
            <li>
              <Link to={`/main`} className="mobile-header__nav-list-item">
                ЛЕНТА
              </Link>
            </li>
            <li>
              <Link to={`/challenges`} className="mobile-header__nav-list-item">
                ЧЕЛЛЕНДЖИ
              </Link>
            </li>
            <li>
              <Link to={`/ratings`} className="mobile-header__nav-list-item">
                РЕЙТИНГИ
              </Link>
            </li>
            <li>
              <Link to={`/activity`} className="mobile-header__nav-list-item">
                АКТИВНОСТЬ
              </Link>
            </li>
            <li>
              <Link to={`/profile`} className="mobile-header__nav-list-item">
                ПРОФИЛЬ
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default MobileHeader
