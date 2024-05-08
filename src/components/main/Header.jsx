import React, { useEffect, useState } from 'react';
import Notification from './Notification';
import { CButtonProfile } from "../Buttons";
import axios from 'axios';

const Header = ({setPage, isFeedPage}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/main', {})
      .then(response => {
        setUserName(response.data.name);
        console.log("Response:", response.data);
        console.log(localStorage.getItem('token'));
      })
      .catch(error => {
        console.error(error);
      });
  }, [userName]);

  return (
    <div className="header">
      <div className="header-title">СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ
      <CButtonProfile textContent={userName ? userName.charAt(0) : ''}></CButtonProfile></div>
      <hr style={{ width: "100%", color: "$white", backgroundColor: "$white", height: "1px" }} />
      <nav className="header-nav">
        <ul className="header-nav-list">
          <li>
            <a href="/main#feed" className="header-nav-list-item" onClick={() => setPage('feed')}>ЛЕНТА</a>
          </li>
          <li>
            <a href="/main#challenges" className="header-nav-list-item" onClick={() => setPage('challenges')}>ЧЕЛЛЕНДЖИ</a>
          </li>
          <li>
            <a href="/main#ratings" className="header-nav-list-item" onClick={() => setPage('ratings')}>РЕЙТИНГИ</a>
          </li>
          <li>
            <a href="/main#activity" className="header-nav-list-item" onClick={() => setPage('activity')}>АКТИВНОСТЬ</a>
          </li>
        </ul>
      </nav>
      {isFeedPage && <Notification isOpen={isNotificationOpen} userName={userName} onClose={() => setIsNotificationOpen(false)} />}
    </div>
  );
};

export default Header;