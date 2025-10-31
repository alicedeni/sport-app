import React, { useEffect, useState } from 'react'
import api from '@shared/services/api'

const TeamAndLeague = ({ tempUser, leagueColor }) => {
  const [teamMembers, setTeamMembers] = useState([])
  const [isMembersVisible, setIsMembersVisible] = useState(false)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get('/user/team_members')
        if (response.data.status === 200) {
          setTeamMembers(response.data.teamMembers)
        } else {
          console.error('Ошибка при загрузке участников команды:', response.data.message)
        }
      } catch (error) {
        console.error('Ошибка при загрузке участников команды:', error)
      }
    }

    fetchTeamMembers()
  }, [tempUser.teamId])

  const toggleMembersVisibility = () => {
    setIsMembersVisible(!isMembersVisible)
  }

  const getParticipantsText = (count) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return `${count} участник`
    } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
      return `${count} участника`
    } else {
      return `${count} участников`
    }
  }

  const getLeagueName = (league) => {
    if (!league) return ''

    const leagueMap = {
      bronze: 'Бронзовая лига',
      silver: 'Серебряная лига',
      gold: 'Золотая лига',
    }

    const lowerLeague = league.toLowerCase()
    return leagueMap[lowerLeague] || league.charAt(0).toUpperCase() + league.slice(1).toLowerCase()
  }

  return (
    <div className="profile-block-content-comands">
      <div className="profile-block-content-comands-items">
        <div className="profile-block-content-comands-items-rect"></div>
        <div className="profile-block-content-comands-items-circle"></div>
        <div className="profile-block-content-comands-item">
          <p className="profile-block-content-comands-item-text">Моя команда</p>
          <p className="profile-block-content-data-title-name">{tempUser.team}</p>
          <div className="team-members-count" onClick={toggleMembersVisibility}>
            {getParticipantsText(teamMembers.length)}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`team-arrow ${isMembersVisible ? 'team-arrow-up' : 'team-arrow-down'}`}
            >
              <path d="M6 9L2 5H10L6 9Z" fill="currentColor" />
            </svg>
          </div>
          {isMembersVisible && (
            <div className="profile-team-members-list">
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <div key={index} className="profile-team-member-item">
                    <div className="profile-team-member-info">
                      <div className="profile-team-member-name">
                        {member.surname} {member.name}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="profile-team-member-item">
                  <div className="profile-team-member-info">
                    <div className="profile-team-member-name">Участников нет</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="profile-block-content-comands-list"></div>
      </div>
      <div className="profile-block-content-comands-items">
        <div
          className="profile-block-content-comands-items-rect"
          style={{ backgroundColor: leagueColor }}
        ></div>
        <div
          className="profile-block-content-comands-items-circle"
          style={{ backgroundColor: leagueColor }}
        ></div>
        <div className="profile-block-content-comands-item">
          <p className="profile-block-content-comands-item-text">Моя лига</p>
          <p className="profile-block-content-data-title-name">{getLeagueName(tempUser.league)}</p>
        </div>
        <p className="profile-block-content-comands-position">
          Вы на {tempUser.place_league} месте!
        </p>
      </div>
    </div>
  )
}

export default TeamAndLeague
