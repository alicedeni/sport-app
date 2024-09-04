import React, { useEffect, useState } from 'react';
import Notification from './Notification';
import { CButtonProfile } from "../Buttons";
import axios from 'axios';

import {link} from '../../consts.js';

const Header = ({ setPage, isFeedPage }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [points, setPoints] = useState(0);
  const [goal, setGoal] = useState(90);
  const [currentPage, setCurrentPage] = useState('');
  const [mainInfo, setMainInfo] = useState({
    teams: 0,
    participants: 0,
    count: 0,
  });
  useEffect(() => {
    axios.get(`${link}/main`, {})
      .then(response => {
        setUserName(response.data.name);
        setAvatar(response.data.avatar);
        setPoints(response.data.points);
        setGoal(response.data.goal);
        setMainInfo({
          teams: response.data.teams,
          participants: response.data.participants,
          count: response.data.count,
        });
        console.log("Response:", response.data);
        console.log(localStorage.getItem('token'));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handlePageChange = (page) => {
    setPage(page);
    setCurrentPage(page);
  };

  const handlePageNotification = () => {
    setIsNotificationOpen(false);
    setCurrentPage('feed');
  };

  return (
    <div className="header">
      <div className="header-title">СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ
        <CButtonProfile points={points}>
          {avatar ? (
            <img src={`${link}/${avatar}`} alt="User Avatar" className="avatar" />
          ) : (
            <div>{userName ? userName.charAt(0) : ''}</div>
          )}
        </CButtonProfile>
      </div>
      <hr style={{ width: "100%", color: "$white", backgroundColor: "$white", height: "1px" }} />
      <nav className="header-nav">
        <ul className="header-nav-list">
          <li>
            <a href="/main#feed" className="header-nav-list-item" onClick={() => handlePageChange('feed')}>ЛЕНТА</a>
          </li>
          <li>
            <a href="/main#challenges" className="header-nav-list-item" onClick={() => handlePageChange('challenges')}>ЧЕЛЛЕНДЖИ</a>
          </li>
          <li>
            <a href="/main#ratings" className="header-nav-list-item" onClick={() => handlePageChange('ratings')}>РЕЙТИНГИ</a>
          </li>
          <li>
            <a href="/main#activity" className="header-nav-list-item" onClick={() => handlePageChange('activity')}>АКТИВНОСТЬ</a>
          </li>
        </ul>
      </nav>
      {isFeedPage && <Notification isOpen={isNotificationOpen} userName={userName} onClose={() => handlePageNotification()} />}
      {((currentPage === 'challenges') || (currentPage === 'feed' && !isNotificationOpen)) && (
        <div className="goal-status">
          <div className="goal-text">Наша цель — Lorem ipsum dolor sit amet.</div>
          <div className="goal-bar">
            <div
              className="goal"
              style={{ width: `${goal}%` }}
            ></div>
          </div>
        </div>
      )}
      {((currentPage === 'feed' && !isNotificationOpen)) && (<div className="goal-info">
        <div className="goal-info__metrics"><span style={{ fontSize: '30px', fontWeight: 'bold' }}>{mainInfo.teams}</span>  команды</div>
          <div className="goal-info__metrics"><span style={{ fontSize: '30px', fontWeight: 'bold' }}>{mainInfo.participants}</span> участников</div>
          <div className="goal-info__metrics"><span style={{ fontSize: '30px', fontWeight: 'bold' }}>{mainInfo.count}</span> собрано</div>
        </div>)}
    </div>
  );
};

export default Header;