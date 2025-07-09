import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TeamModal from './TeamModal'

import { link } from '../../consts.js'

const Ratings = () => {
  const [selectedSide, setSelectedSide] = useState('left')
  const [participants, setParticipants] = useState([])
  const [teams, setTeams] = useState([])
  const [selectedLeague, setSelectedLeague] = useState([1])
  const [leagues, setLeagues] = useState([
    { id: 1, name: 'ВСЕ УЧАСТНИКИ', color: '#51B8FF', ind: 'ВСЕ УЧАСТНИКИ' },
    { id: 2, name: 'ЗОЛОТАЯ ЛИГА', color: '#FFCC38', ind: 'gold' },
    { id: 3, name: 'СЕРЕБРЯНАЯ ЛИГА', color: '#0078D4', ind: 'silver' },
    { id: 4, name: 'БРОНЗОВАЯ ЛИГА', color: '#FF3D75', ind: 'bronze' },
  ])
  const [showModal, setShowModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [teamColor, setTeamColor] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (selectedSide === 'left') {
          const response = await axios.get(`${link}/participants-rating`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (Array.isArray(response.data.leaderboard)) {
            setParticipants(response.data.leaderboard)
          } else {
            console.error('Unexpected data format for participants:', response.data)
            setParticipants([])
          }
        } else {
          const response = await axios.get(`${link}/teams-rating`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (Array.isArray(response.data.leaderboard)) {
            setTeams(response.data.leaderboard)
          } else {
            console.error('Unexpected data format for teams:', response.data)
            setTeams([])
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [selectedSide])

  const handleClick = (side) => {
    setSelectedSide(side)
  }

  const handleLeagueClick = (league) => {
    if (selectedLeague.length === 1 && selectedLeague[0] === league) {
      return
    } else {
      if (selectedLeague.includes(1) && league !== 1) {
        setSelectedLeague((prevLeagues) => prevLeagues.filter((l) => l !== 1).concat([league]))
      } else if (!selectedLeague.includes(1) && league === 1) {
        setSelectedLeague([1])
      } else {
        if (selectedLeague.includes(league)) {
          setSelectedLeague((prevLeagues) => prevLeagues.filter((l) => l !== league))
        } else {
          setSelectedLeague((prevLeagues) => [...prevLeagues, league])
        }
      }
    }
  }

  const filteredParticipants = participants.filter((participant) => {
    if (selectedLeague.includes(1)) {
      return true
    } else {
      return selectedLeague.includes(
        leagues.find((league) => league.ind.toLowerCase() === participant.league.toLowerCase())?.id,
      )
    }
  })

  const handleTeamClick = (team, index) => {
    setSelectedTeam(team)
    setTeamColor(participantColors[index] || 'white')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedTeam(null)
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

  const teamGradients = [
    'linear-gradient(to right, rgba(255, 204, 56, 0.3) 10%, white 25%)',
    'linear-gradient(to right, rgba(0, 120, 212, 0.3) 10%, white 25%)',
    'linear-gradient(to right, rgba(255, 61, 117, 0.3) 10%, white 25%)',
  ]

  const participantColors = ['#f4dd84', '#82ade0', '#e891ac']

  return (
    <div className="ratings">
      <div className="ratings-select_pt">
        <div
          className="ratings-select_pt-variant"
          style={{ backgroundColor: selectedSide === 'left' ? 'rgba(81, 184, 255, 0.2)' : 'white' }}
          onClick={() => handleClick('left')}
        >
          По участникам
        </div>
        <div
          className="ratings-select_pt-variant"
          style={{
            backgroundColor: selectedSide === 'right' ? 'rgba(81, 184, 255, 0.2)' : 'white',
          }}
          onClick={() => handleClick('right')}
        >
          По командам
        </div>
      </div>

      {selectedSide === 'left' ? (
        <div className="ratings-participants-list">
          {/* <div className="ratings-participants-leagues">
            {leagues.map((league, index) => (
              <div
                key={league.id}
                className="ratings-participants-leagues-variant"
                style={{
                  backgroundColor: selectedLeague.includes(league.id)
                    ? league.color
                    : 'transparent',
                  border: selectedLeague.includes(league.id)
                    ? '2px solid ' + league.color
                    : '2px solid ' + league.color,
                  color: selectedLeague.includes(league.id) ? 'white' : league.color,
                }}
                onClick={() => handleLeagueClick(league.id)}
              >
                {league.name}
              </div>
            ))}
          </div>
          */}
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Участник</th>
                <th>Команда</th>
                <th>Прогресс</th>
                <th>Лига</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant, index) => (
                <tr key={participant.id}>
                  <td>{index + 1}</td>
                  <td>
                    {participant.lastName} {participant.firstName}
                  </td>
                  <td>{participant.team}</td>
                  <td>{participant.progress}</td>
                  <td>
                    <span
                      className="league-badge"
                      style={{
                        backgroundColor:
                          participant.league.toLowerCase() === 'gold'
                            ? '#f4dd84'
                            : participant.league.toLowerCase() === 'silver'
                              ? '#82ade0'
                              : participant.league.toLowerCase() === 'bronze'
                                ? '#e891ac'
                                : 'white',
                      }}
                    ></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ratings-teams-list">
          {teams.map((team, index) => (
            <div
              key={team.id}
              className="ratings-teams-list-team-item"
              onClick={() => handleTeamClick(team, index)}
              style={{
                background: teamGradients[index] || 'white',
              }}
            >
              <div className="ratings-teams-list-team-item-team">
                {index === 0 ? (
                  <div className="ratings-teams-list-team-item-team-num">
                    <img
                      src="https://storage.yandexcloud.net/team2go/users/base/1.svg"
                      alt="Gold Medal"
                      className="medal-icon"
                    />
                  </div>
                ) : index === 1 ? (
                  <div className="ratings-teams-list-team-item-team-num">
                    <img
                      src="https://storage.yandexcloud.net/team2go/users/base/2.svg"
                      alt="Silver Medal"
                      className="medal-icon"
                    />
                  </div>
                ) : index === 2 ? (
                  <div className="ratings-teams-list-team-item-team-num">
                    <img
                      src="https://storage.yandexcloud.net/team2go/users/base/3.svg"
                      alt="Bronze Medal"
                      className="medal-icon"
                    />
                  </div>
                ) : (
                  <div className="ratings-teams-list-team-item-team-num-s">{index + 1}</div>
                )}
                <img
                  src="https://storage.yandexcloud.net/team2go/users/base/cat1.svg"
                  alt="Team Icon"
                  className="team-icon"
                />
              </div>
              <div className="ratings-teams-list-team-item-team-name">{team.name}</div>
              <div className="ratings-teams-list-team-item-team-members">
                {getParticipantsText(team.members)}
              </div>
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
          teamColor={teamColor}
        />
      )}
    </div>
  )
}

export default Ratings
