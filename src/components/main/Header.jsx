import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Notification from './Notification';
import { CButtonProfile } from "../Buttons";
import axios from 'axios';
import { link } from '../../consts.js';

const Header = ({ currentPage }) => {
  const { id } = useParams();
  const [isNotificationOpen, setIsNotificationOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [points, setPoints] = useState(0);
  const [goal, setGoal] = useState(0);
  const [mainInfo, setMainInfo] = useState({
    teams: 0,
    participants: 0,
    count: 0,
  });

  useEffect(() => {
    axios.get(`${link}/main`)
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
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handlePageNotification = () => {
    setIsNotificationOpen(false);
  };

  return (
    <div className="header" style={{ marginBottom: (currentPage === 'feed' || currentPage === 'challenges') ? '100px' : '0' }}>
      <div className="header-title">СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ
        <CButtonProfile points={points}>
          {avatar ? (
            <img src={`${avatar}`} alt="User Avatar" className="avatar" />
          ) : (
            <div className="avatar-default">{userName ? userName.charAt(0) : ''}</div>
          )}
        </CButtonProfile>
      </div>
      <hr style={{ width: "100%", color: "$white", backgroundColor: "$white", height: "1px" }} />
      <nav className="header-nav">
        <div className="header-nav-list">
          <Link to={`/main/${id}`} className="header-nav-list-item">ЛЕНТА</Link>
          <Link to={`/challenges/${id}`} className="header-nav-list-item">ЧЕЛЛЕНДЖИ</Link>
          <Link to={`/ratings/${id}`} className="header-nav-list-item">РЕЙТИНГИ</Link>
          <Link to={`/activity/${id}`} className="header-nav-list-item">АКТИВНОСТЬ</Link>  
        </div>
      </nav>

      {currentPage === 'feed' && isNotificationOpen && (
        <Notification isOpen={isNotificationOpen} userName={userName} onClose={handlePageNotification}/>
      )}

      {(currentPage === 'challenges' || (currentPage === 'feed' && !isNotificationOpen)) && (
        <div className="goal-status">
          <div className="goal-text">Наша цель — Прошагать 10000 км.</div>
          <div className="goal-bar">
            <div className="goal" style={{ width: `${goal}%` }}></div>
          </div>
        </div>
      )}

      {currentPage === 'feed' && !isNotificationOpen && (
        <div className="goal-info">
          <div className="goal-info__metrics"><span style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '10px' }}>{mainInfo.teams}</span>  команды</div>
          <div className="goal-info__metrics"><span style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '10px' }}>{mainInfo.participants}</span> участников</div>
          <div className="goal-info__metrics"><span style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '10px' }}>{mainInfo.count}</span> пройдено</div>
        </div>
      )}
    </div>
  );
};

export default Header;