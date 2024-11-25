import React, { useState, useEffect } from 'react';
import { ButtonActivity, ButtonEnter } from "../Buttons";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {link} from '../../consts.js';

const Activity = () => {
  const [selectedSide, setSelectedSide] = useState('week');
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        let response;
        const token = localStorage.getItem('token');
        if (selectedSide === 'week') {
          response = await axios.get(`${link}/user/activities/week`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else if (selectedSide === 'month') {
          response = await axios.get(`${link}/user/activities/month`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          response = await axios.get(`${link}/user/activities/all`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        setActivities(response.data.activities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();
  }, [selectedSide]);

  const handleClick = (side) => {
    setSelectedSide(side);
  };

  const handleFormChange = () => {
    navigate(`/activity_make`, { state: { page: "activity" } });
  };

  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatMinutesToHours = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes}`;
  };

  const getTotalTime = () => {
    const totalMinutes = activities.reduce((total, activity) => total + parseTimeToMinutes(activity.time), 0);
    return formatMinutesToHours(totalMinutes);
  };

  const getPeriodText = () => {
    switch (selectedSide) {
      case 'week':
        return 'за неделю';
      case 'month':
        return 'за месяц';
      case 'week && month':
        return 'за все время';
      default:
        return '';
    }
  };

  return (
    <div className="activity">
        
        <ButtonActivity className="welcome-block__btn" text="Добавить активность" textContent={"Добавить активность"} onClick={handleFormChange}></ButtonActivity>
        <div className="select_time">
          <div className="select_time-variant" style={{backgroundColor: selectedSide === 'week' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('week')}>За неделю</div>
          <div className="select_time-variant" style={{backgroundColor: selectedSide === 'month' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('month')}>За месяц</div>
          <div className="select_time-variant" style={{backgroundColor: selectedSide === 'week && month' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('week && month')}>За все время</div>
        </div>
        <div className="activity-total">Всего: {getTotalTime()} часов активности {getPeriodText()}</div>

        <div className="activity-list">
          {activities.map((activity, index) => (
            <div key={index} className="activity-list-item">
              <div key={activity.type} id={activity.tag} className={`activity-tags ${activity.tag}-M`}>
                {activity.type.toUpperCase()}
              </div>
              <div className={`activity-list-item-time ${activity.tag}`}>{activity.time} часов</div>
              {selectedSide !== 'week && month' && (<div className="activity-list-item-average">В среднем {activity.average} минуты в день</div>)}
            </div>
          ))}
        </div>
    </div>
  );
};

export default Activity;
