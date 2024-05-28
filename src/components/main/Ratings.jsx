import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ratings = () => {
  const [selectedSide, setSelectedSide] = useState('left');
  const [participants, setParticipants] = useState([]);
  const [teams, setTeams] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedSide === 'left') {
          const response = await axios.get('http://localhost:5000/participants-rating');
          if (Array.isArray(response.data.leaderboard)) {
            setParticipants(response.data.leaderboard);
          } else {
            console.error('Unexpected data format for participants:', response.data);
            setParticipants([]);
          }
        } else {
          const response = await axios.get('http://localhost:5000/teams-rating');
          if (Array.isArray(response.data.leaderboard)) {
            setTeams(response.data.leaderboard);
          } else {
            console.error('Unexpected data format for teams:', response.data);
            setTeams([]);
          }
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