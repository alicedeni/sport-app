import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Challenges = () => {
  const [selectedSide, setSelectedSide] = useState('current');
  const [currentChallenges, setCurrentChallenges] = useState([
    { id: 1, name: 'Пробежать 10 км', progress: 75, points: 100 },
    { id: 2, name: 'Отжаться 100 раз', progress: 50, points: 50 },
    { id: 3, name: 'Проплыть 1 км', progress: 90, points: 75 },
  ]);
  const [completedChallenges, setCompletedChallenges] = useState([
    { id: 1, name: 'Сделать 1000 шагов',progress: 100, points: 25 },
    { id: 2, name: 'Поднять 50 кг', progress: 100, points: 75 },
    { id: 3, name: 'Отжаться 50 раз', progress: 90, points: 50 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedSide === 'current') {
          const response = await axios.get('http://localhost:5000/current-challenges');
          setCurrentChallenges(response.data);
        } else {
          const response = await axios.get('http://localhost:5000/completed-challenges');
          setCompletedChallenges(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selectedSide]);

  const handleClick = (side) => {
    setSelectedSide(side);
  };

  return (
    <div className="challenges">
      <div className="select_pt">
        <div
          className="select_pt-variant"
          style={{
            backgroundColor: selectedSide === 'current' ? 'rgba(81, 184, 255, 0.2)' : 'white',
          }}
          onClick={() => handleClick('current')}
        >
          Текущие челленджи
        </div>
        <div
          className="select_pt-variant"
          style={{
            backgroundColor: selectedSide === 'completed' ? 'rgba(81, 184, 255, 0.2)' : 'white',
          }}
          onClick={() => handleClick('completed')}
        >
          Выполненные челленджи
        </div>
      </div>

      {selectedSide === 'current' ? (
        <div className="current-challenges">
          {currentChallenges.map((challenge) => (
            <div key={challenge.id} className="challenge-item">
              <h3>{challenge.name}</h3>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${challenge.progress}%` }}
                ></div>
              </div>
              <div className="points">{challenge.points} баллов</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="completed-challenges">
          {completedChallenges.map((challenge) => (
            <div key={challenge.id} className="challenge-item">
              <h3>{challenge.name}</h3>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${challenge.progress}%` }}
                ></div>
              </div>
              <div className="points">{challenge.points} баллов</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Challenges;