import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeamModal from './TeamModal';

const Ratings = () => {
  const [selectedSide, setSelectedSide] = useState('left');
  const [participants, setParticipants] = useState([
    { id: 1, firstName: 'Иван', lastName: 'Иванов', team: 'Команда 1', progress: 500, league: 'gold' },
    { id: 2, firstName: 'Алиса', lastName: 'Денисова', team: 'Команда 3', progress: 470, league: 'gold' },
    { id: 3, firstName: 'Петр', lastName: 'Петров', team: 'Команда 2', progress: 400, league: 'silver' },
    { id: 4, firstName: 'Сидор', lastName: 'Сидоров', team: 'Команда 1', progress: 200, league: 'bronze' },
  ]);
  const [teams, setTeams] = useState([
    { id: 1, name: 'Команда 1', members: 10, totalProgress: 5000 },
    { id: 2, name: 'Команда 2', members: 8, totalProgress: 3500 },
    { id: 3, name: 'Команда 3', members: 12, totalProgress: 4200 },
    { id: 4, name: 'Команда 4', members: 2, totalProgress: 4000 },
  ]);
  const [selectedLeague, setSelectedLeague] = useState([1]);
  const [leagues, setLeagues] = useState([
    { id: 1, name: 'ВСЕ УЧАСТНИКИ', color: '#51B8FF', ind: 'ВСЕ УЧАСТНИКИ' },
    { id: 2, name: 'ЗОЛОТАЯ ЛИГА', color: '#FFCC38', ind: 'gold' },
    { id: 3, name: 'СЕРЕБРЯНАЯ ЛИГА', color: '#0078D4', ind: 'silver'  },
    { id: 4, name: 'БРОНЗОВАЯ ЛИГА', color: '#FF3D75', ind: 'bronze' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

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

  const handleLeagueClick = (league) => {
    if (selectedLeague.length === 1 && selectedLeague[0] === league) {
      return;
    } else {
      if (selectedLeague.includes(1) && league !== 1) {
        setSelectedLeague((prevLeagues) => prevLeagues.filter((l) => l !== 1).concat([league]));
      } else if (!selectedLeague.includes(1) && league === 1) {
        setSelectedLeague([1]);
      } else {
        if (selectedLeague.includes(league)) {
          setSelectedLeague((prevLeagues) => prevLeagues.filter((l) => l !== league));
        } else {
          setSelectedLeague((prevLeagues) => [...prevLeagues, league]);
        }
      }
    }
  };

  const filteredParticipants = participants.filter((participant) => {
    if (selectedLeague.includes(1)) {
      return true;
    } else {
      return selectedLeague.includes(leagues.find((league) => league.ind.toLowerCase() === participant.league.toLowerCase())?.id);
    }
  });

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  return (
    <div className="ratings">
      <div className="ratings-select_pt">
        <div className="ratings-select_pt-variant" style={{backgroundColor: selectedSide === 'left' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('left')}>По участникам</div>
        <div className="ratings-select_pt-variant" style={{backgroundColor: selectedSide === 'right' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('right')}>По командам</div>
      </div>
      
      {selectedSide === 'left' ? (
        <div className="ratings-participants-list">
          <div className="ratings-participants-leagues">
            {leagues.map((league, index) => (
              <div
                key={league.id}
                className="ratings-participants-leagues-variant"
                style={{
                  backgroundColor: selectedLeague.includes(league.id) ? league.color : 'transparent',
                  border: selectedLeague.includes(league.id) ? '2px solid ' + league.color : '2px solid ' + league.color,
                  color: selectedLeague.includes(league.id) ? 'white' : league.color,
                }}
                onClick={() => handleLeagueClick(league.id)}
              >
                {league.name}
              </div>
            ))}
          </div>
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
              {selectedLeague.includes(1) ? (
                <>
                  <tr>
                    <th colSpan="4" className="league-title" style={{ backgroundColor: 'transparent', color: leagues.find((l) => l.id === 2)?.color, textAlign: 'left', padding: '10px' }}>
                      {leagues.find((l) => l.id === 2)?.name}
                    </th>
                  </tr>
                  {filteredParticipants.filter((participant) => participant.league.toLowerCase() === 'gold').map((participant, index) => (
                    <tr key={participant.id}>
                      <td>{index + 1}</td>
                      <td>{participant.lastName} {participant.firstName}</td>
                      <td>{participant.team}</td>
                      <td>{participant.progress}</td>
                    </tr>
                  ))}
                  <tr>
                    <th colSpan="4" className="league-title" style={{ backgroundColor: 'transparent', color: leagues.find((l) => l.id === 3)?.color, textAlign: 'left', padding: '10px' }}>
                      {leagues.find((l) => l.id === 3)?.name}
                    </th>
                  </tr>
                  {filteredParticipants.filter((participant) => participant.league.toLowerCase() === 'silver').map((participant, index) => (
                    <tr key={participant.id}>
                      <td>{index + 1}</td>
                      <td>{participant.lastName} {participant.firstName}</td>
                      <td>{participant.team}</td>
                      <td>{participant.progress}</td>
                    </tr>
                  ))}
                  <tr>
                    <th colSpan="4" className="league-title" style={{ backgroundColor: 'transparent', color: leagues.find((l) => l.id === 4)?.color, textAlign: 'left', padding: '10px' }}>
                      {leagues.find((l) => l.id === 4)?.name}
                    </th>
                  </tr>
                  {filteredParticipants.filter((participant) => participant.league.toLowerCase() === 'bronze').map((participant, index) => (
                    <tr key={participant.id}>
                      <td>{index + 1}</td>
                      <td>{participant.lastName} {participant.firstName}</td>
                      <td>{participant.team}</td>
                      <td>{participant.progress}</td>
                    </tr>
                  ))}
                </>
              ) : (
                leagues.filter((league) => selectedLeague.includes(league.id)).map((league) => (
                  <React.Fragment key={league.id}>
                    <tr>
                      <th colSpan="4" className="league-title" style={{ backgroundColor: 'transparent', color: league.color, textAlign: 'left', padding: '10px' }}>
                        {league.name}
                      </th>
                    </tr>
                    {filteredParticipants.filter((participant) => leagues.find((l) => l.ind.toLowerCase() === participant.league.toLowerCase())?.id === league.id).map((participant, index) => (
                      <tr key={participant.id}>
                        <td>{index + 1}</td>
                        <td>{participant.lastName} {participant.firstName}</td>
                        <td>{participant.team}</td>
                        <td>{participant.progress}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ratings-teams-list">
          {teams.map((team) => (
            <div
              key={team.id}
              className="ratings-teams-list-team-item"
              onClick={() => handleTeamClick(team)}
            >
              <div className="ratings-teams-list-team-item-team-num">{team.id}</div>
              <div className="ratings-teams-list-team-item-team-name">{team.name}</div>
              <div className="ratings-teams-list-team-item-team-members">{team.members} участников</div>
              <div className="ratings-teams-list-team-item-team-progress">{team.totalProgress}</div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <TeamModal
          team={selectedTeam}
          onClose={handleCloseModal}
          participants={participants}
        />
      )}
    </div>
  );
};

export default Ratings;