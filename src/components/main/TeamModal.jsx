import React from 'react';

const TeamModal = ({ team, onClose, participants }) => {
  const teamParticipants = participants.filter((participant) => participant.team === team.name);

  return (
    <div className="team-modal">
      <div className="team-modal-content">
        <div className="team-modal-header">
          <h3>{team.name}</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="team-modal-body">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Участник</th>
                <th>Прогресс</th>
              </tr>
            </thead>
            <tbody>
              {teamParticipants.map((participant, index) => (
                <tr key={participant.id}>
                  <td>{index + 1}</td>
                  <td>{participant.lastName} {participant.firstName}</td>
                  <td>{participant.progress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;