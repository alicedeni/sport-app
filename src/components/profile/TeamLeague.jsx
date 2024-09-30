import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { link } from '../../consts.js';
import { useParams } from 'react-router-dom';

const TeamAndLeague = ({ tempUser, leagueColor }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isMembersVisible, setIsMembersVisible] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${link}/user/${id}/team_members`);
        if (response.data.status === 200) {
          setTeamMembers(response.data.teamMembers);
        } else {
          console.error('Ошибка при загрузке участников команды:', response.data.message);
        }
      } catch (error) {
        console.error('Ошибка при загрузке участников команды:', error);
      }
    };

    fetchTeamMembers();
  }, [tempUser.teamId]);

  const toggleMembersVisibility = () => {
    setIsMembersVisible(!isMembersVisible);
  };

  return (
    <div className="profile-block-content-comands">
      <div className="profile-block-content-comands-items">
        <div className="profile-block-content-comands-items-rect"></div>
        <div className="profile-block-content-comands-items-circle"></div>
        <div className="profile-block-content-comands-item"> 
          <p className="profile-block-content-comands-item-text">Моя команда</p>
          <p className="profile-block-content-data-title-name">{tempUser.team}</p>
          <div className="team-members-count" onClick={toggleMembersVisibility}>
            {teamMembers.length} участников
            <span className={`arrow ${isMembersVisible ? 'arrow-up' : 'arrow-down'}`}></span>
          </div>
          {isMembersVisible && (
            <ul className="team-members-list">
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  // <li key={index} className="team-member-item">{member.name || member}</li>\
                  <li key={index} className="team-member-item">
                  {member.surname} {member.name}
                  </li>
                ))
              ) : (
                <li className="team-member-item">Участников нет</li>
              )}
            </ul>
          )}
        </div>
        <div className="profile-block-content-comands-list"></div>
      </div>
      <div className="profile-block-content-comands-items">
        <div className="profile-block-content-comands-items-rect" style={{ backgroundColor: leagueColor }}></div>
        <div className="profile-block-content-comands-items-circle" style={{ backgroundColor: leagueColor }}></div>
        <div className="profile-block-content-comands-item"> 
          <p className="profile-block-content-comands-item-text">Моя лига</p>
          <p className="profile-block-content-data-title-name">{tempUser.league}</p>
        </div>
        <p className="profile-block-content-comands-position">Вы на {tempUser.place_league} месте в {tempUser.league} лиге!</p>
      </div>
    </div>
  );
};

export default TeamAndLeague;