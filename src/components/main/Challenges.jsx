import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {link} from '../../consts.js';

const Challenges = () => {
  const [selectedSide, setSelectedSide] = useState('current');
  const [currentChallenges, setCurrentChallenges] = useState([/*
    { id: 1, name: 'Пробежать 10 км', progress: 75, points: 100 },
    { id: 2, name: 'Отжаться 100 раз', progress: 50, points: 50 },
    { id: 3, name: 'Проплыть 1 км', progress: 90, points: 75 },
*/]);
  const [completedChallenges, setCompletedChallenges] = useState([/*
    { id: 1, name: 'Сделать 1000 шагов',progress: 100, points: 25 },
    { id: 2, name: 'Поднять 50 кг', progress: 100, points: 75 },
*/]);
  const [incompletedChallenges, setIncompletedChallenges] = useState([/*
    { id: 3, name: 'Отжаться 50 раз', progress: 90, points: 50 },
*/]);

{/* 
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        let response;
        if (selectedSide === 'current') {
          response = await axios.get(`${link}/current-challenges`);
        } else {
          response = await axios.get(`${link}/completed-challenges`);
        }
        if (isMounted) {
          const data = response.data;
          if (data.status === 200) {
            if (selectedSide === 'current') {
              setCurrentChallenges(data.current_challenges || []);
            } else {
              setCompletedChallenges(data.completed_challenges || []);
              setIncompletedChallenges(data.incompleted_challenges || []);
            }
          } else {
            console.error('Data error:', data.message);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedSide]);
*/}
  const handleClick = (side) => {
    setSelectedSide(side);
  };

  const calculateCompletedPoints = () => {
    return completedChallenges.filter(challenge => challenge.progress === 100)
      .reduce((total, challenge) => total + challenge.points, 0);
  };

  return (
    <div className="challenges">
      <div className="select_pt">
        <div
          className="select_pt-variant"
          style={{
            color: selectedSide === 'current' ? '#51B8FF' : '#808080',
            fontSize: selectedSide === 'current' ? '40px' : '32px',
            borderBottom: selectedSide === 'current' ? '2px solid #51B8FF' : 'none',
          }}
          onClick={() => handleClick('current')}
        >
          Текущие челленджи
        </div>
        <div
          className="select_pt-variant"
          style={{
            color: selectedSide === 'completed' ? '#51B8FF' : '#808080',
            fontSize: selectedSide === 'completed' ? '40px' : '32px',
            borderBottom: selectedSide === 'completed' ? '2px solid #51B8FF' : 'none',
          }}
          onClick={() => handleClick('completed')}
        >
          Выполненные челленджи
        </div>
      </div>

      {selectedSide === 'current' ? (
        <div className="current-challenges">
          <div className="metrics">Выбрано <span style={{ color: '#51B8FF' }}>{currentChallenges.length}/{currentChallenges.length}</span></div>
          {currentChallenges.length > 0 ? (
            currentChallenges.map((challenge) => (
              <div key={challenge.id} className="challenge-item">
                <div className="challenge-item-text">
                  <h3 className="challenge-item-text-name">{challenge.name}</h3>
                  <div className="challenge-item-text-points">{challenge.points} баллов</div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
            </div>
          ))
          ) : (
            <div>No current challenges</div>
          )}
        </div>
      ) : (
        <div className="completed-challenges">
          <div className="metrics">Выполненные: <span style={{ color: '#51B8FF' }}>{completedChallenges.length}</span></div>
          <div className="metrics">Незавершенные: <span style={{ color: '#51B8FF' }}>{incompletedChallenges.length}</span></div>
          <div className="metrics">Заработано баллов: <span style={{ color: '#51B8FF' }}>{calculateCompletedPoints()}</span></div>
          {completedChallenges.length > 0 ? (
            completedChallenges.map((challenge) => (
              <div key={challenge.id} className="challenge-item">
                <div className="challenge-item-text">
                  <h3 className="challenge-item-text-name">{challenge.name}</h3>
                  <div
                    className="challenge-item-text-points"
                    style={{
                      color: '#51B8FF',
                      backgroundColor:'rgba(81, 184, 255, 0.2)',
                    }}
                  >
                    {challenge.points} баллов
                  </div>
                </div>
                <div className="progress-bar" >
                  <div
                    className="progress"
                    style={{ width: `${challenge.progress}%`,}}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div>No completed challenges</div>
          )}
          <div className="challenge-line"></div>
          {incompletedChallenges.length > 0 ? (
            incompletedChallenges.map((challenge) => (
              <div key={challenge.id} className="challenge-item">
                <div className="challenge-item-text" style={{ opacity: 0.7, }}>
                  <h3 className="challenge-item-text-name" style={{ opacity: 0.7, }}>{challenge.name}</h3>
                  <div
                    className="challenge-item-text-points"
                    style={{
                      color: '#FF4D53',
                      backgroundColor: 'rgba(255, 77, 83, 0.2)',
                      opacity: 0.7, 
                    }}
                  >
                    {challenge.points} баллов
                  </div>
                </div>
                <div className="progress-bar" style={{ opacity: 0.7, }}>
                  <div
                    className="progress"
                    style={{ width: `${challenge.progress}%`,
                    opacity: 0.7, }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
};

export default Challenges;