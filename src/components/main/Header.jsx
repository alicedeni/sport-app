import React, { useEffect, useState } from 'react';
import { ButtonProfile } from "../Buttons";
import axios from 'axios';


const Header = ({setPage}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/login')
      .then(response => {
        setUserName(response.data.name);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="header">
      <h1 className="header-title">СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ</h1>
      <hr style={{ width: "100%", color: "$white", backgroundColor: "$white", height: "1px" }} />
      <nav className="header-nav">
        <ul className="header-nav-list">
          <li>
            <a href="#feed" className="header-nav-list-item" onClick={() => setPage('feed')}>ЛЕНТА</a>
          </li>
          <li>
            <a href="#challenges" className="header-nav-list-item" onClick={() => setPage('challenges')}>ЧЕЛЛЕНДЖИ</a>
          </li>
          <li>
            <a href="#ratings" className="header-nav-list-item" onClick={() => setPage('ratings')}>РЕЙТИНГИ</a>
          </li>
          <li>
            <a href="#activity" className="header-nav-list-item" onClick={() => setPage('activity')}>АКТИВНОСТЬ</a>
          </li>
        </ul>
      </nav>
      {isNotificationOpen && (
        <div className="header-notification">
          <h1 className="header-notification-title">Привет, {userName}!</h1>
          <p className="header-notification-text">Рады видеть тебя в нашем спортивном челлендже. Наша глобальная цель — Lorem ipsum dolor sit amet.<br></br>Основное соревнование начнется со второй недели, а пока что ты можешь заполнить данные о себе и свои персональные цели в личном профиле.</p>
          <ButtonProfile className="welcome-block__btn" text="Личный профиль" textContent={"Личный профиль"}></ButtonProfile>
          <button className="header-notification-close" onClick={() => setIsNotificationOpen(false)}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="6.53552" width="5" height="42" rx="2.5" transform="rotate(-45 3 6.53552)" fill="#BDBDBD"/>
              <rect width="5" height="42" rx="2.5" transform="matrix(0.707107 0.707107 0.707107 -0.707107 3 33)" fill="#BDBDBD"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;