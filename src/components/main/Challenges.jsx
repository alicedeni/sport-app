import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Challenges = () => {
  const [selectedSide, setSelectedSide] = useState('current');
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        let response;
        if (selectedSide === 'current') {
          response = await axios.get('http://localhost:5000/current-challenges');
        } else {
          response = await axios.get('http://localhost:5000/completed-challenges');
        }
        if (isMounted) {
          const data = response.data;
          if (data.status === 200) {
            if (selectedSide === 'current') {
              setCurrentChallenges(data.current_challenges || []);
            } else {
              setCompletedChallenges(data.completed_challenges || []);
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
          {currentChallenges.length > 0 ? (
            currentChallenges.map((challenge) => (
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
            ))
          ) : (
            <div>No current challenges</div>
          )}
        </div>
      ) : (
        <div className="completed-challenges">
          {completedChallenges.length > 0 ? (
            completedChallenges.map((challenge) => (
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
            ))
          ) : (
            <div>No completed challenges</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Challenges;
