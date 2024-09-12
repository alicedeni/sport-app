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
  const [goal, setGoal] = useState(90);
  const [mainInfo, setMainInfo] = useState({
    teams: 0,
    participants: 0,
    count: 0,
  });

  useEffect(() => {
    axios.get(`${link}/user/${id}/main`)
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
            <Link to={`/main/${id}`} className="header-nav-list-item">ЛЕНТА</Link>
          </li>
          <li>
            <Link to={`/challenges/${id}`} className="header-nav-list-item">ЧЕЛЛЕНДЖИ</Link>
          </li>
          <li>
            <Link to={`/ratings/${id}`} className="header-nav-list-item">РЕЙТИНГИ</Link>
          </li>
          <li>
            <Link to={`/activity/${id}`} className="header-nav-list-item">АКТИВНОСТЬ</Link>
          </li>
        </ul>
      </nav>

      {currentPage === 'feed' && isNotificationOpen && (
        <Notification isOpen={isNotificationOpen} userName={userName} onClose={handlePageNotification} />
      )}

      {currentPage === 'challenges' && (
        <div className="goal-status">
          <div className="goal-text">Наша цель — Lorem ipsum dolor sit amet.</div>
          <div className="goal-bar">
            <div className="goal" style={{ width: `${goal}%` }}></div>
          </div>
        </div>
      )}

      {currentPage === 'feed' && !isNotificationOpen && (
        <div className="goal-info">
          <div className="goal-info__metrics"><span style={{ fontSize: '30px', fontWeight: 'bold' }}>{mainInfo.teams}</span>  команды</div>
          <div className="goal-info__metrics"><span style={{ fontSize: '30px', fontWeight: 'bold' }}>{mainInfo.participants}</span> участников</div>
          <div className="goal-info__metrics"><span style={{ fontSize: '30px', fontWeight: 'bold' }}>{mainInfo.count}</span> собрано</div>
        </div>
      )}
    </div>
  );
};

export default Header;