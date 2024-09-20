import React from 'react';

const TeamModal = ({ team, onClose, participants }) => {
  if (!team) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{team.name}</h2>
        <p>Количество участников: {team.members}</p>
        <p>Общий прогресс: {team.totalProgress}</p>
        <h3>Участники:</h3>
        <ul>
          {participants
            .filter(participant => participant.team === team.name)
            .map(participant => (
              <li key={participant.id}>
                {participant.lastName} {participant.firstName} - Прогресс: {participant.progress}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamModal;