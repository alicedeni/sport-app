import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ratings = () => {
  const [selectedSide, setSelectedSide] = useState('left');
  const [participants, setParticipants] = useState([
    { id: 1, firstName: 'Иван', lastName: 'Иванов', team: 'Команда 1', progress: 500 },
    { id: 2, firstName: 'Петр', lastName: 'Петров', team: 'Команда 2', progress: 400 },
    { id: 3, firstName: 'Сидор', lastName: 'Сидоров', team: 'Команда 1', progress: 200 },
  ]);
  const [teams, setTeams] = useState([
    { id: 1, name: 'Команда 1', members: 10, totalProgress: 5000 },
    { id: 2, name: 'Команда 2', members: 8, totalProgress: 3500 },
    { id: 3, name: 'Команда 3', members: 12, totalProgress: 4200 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedSide === 'left') {
          const response = await axios.get('http://localhost:5000/participants');
          setParticipants(response.data);
        } else {
          const response = await axios.get('http://localhost:5000/teams');
          setTeams(response.data);
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
    <div className="ratings">
      <div className="ratings-select_pt">
        <div className="ratings-select_pt-variant" style={{backgroundColor: selectedSide === 'left' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('left')}>По участникам</div>
        <div className="ratings-select_pt-variant" style={{backgroundColor: selectedSide === 'right' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('right')}>По командам</div>
      </div>
      {selectedSide === 'left' ? (
        <div className="ratings-participants-list">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Участник</th>
                <th>Команда</th>
                <th>Прогресс</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr key={participant.id}>
                  <td>{index + 1}</td>
                  <td>{participant.lastName} {participant.firstName}</td>
                  <td>{participant.team}</td>
                  <td>{participant.progress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ratings-teams-list">
          {teams.map((team) => (
            <div key={team.id} className="ratings-teams-list-team-item">
              <div className="ratings-teams-list-team-item-team-num">{team.id}</div>
              <div className="ratings-teams-list-team-item-team-name">{team.name}</div>
              <div className="ratings-teams-list-team-item-team-members">{team.members} участников</div>
              <div className="ratings-teams-list-team-item-team-progress">{team.totalProgress}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ratings;