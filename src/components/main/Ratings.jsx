import React, { useState, useEffect } from 'react'
import { TeamModal, PublicProfileModal } from '@components/modals/index.js'
import api from '@shared/services/api'

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
  const [showPublicProfile, setShowPublicProfile] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedSide === 'left') {
          const response = await api.get('/participants-rating')
          if (Array.isArray(response.data.leaderboard)) {
            setParticipants(response.data.leaderboard)
          } else {
            console.error('Unexpected data format for participants:', response.data)
            setParticipants([])
          }
        } else {
          const response = await api.get('/teams-rating')
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

  const handleUserClick = (participant, index) => {
    const userWithRank = {
      ...participant,
      rank: index + 1,
    }
    setSelectedUser(userWithRank)
    setShowPublicProfile(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedTeam(null)
  }

  const handleClosePublicProfile = () => {
    setShowPublicProfile(false)
    setSelectedUser(null)
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
          className={`ratings-select_pt-variant ${selectedSide === 'left' ? 'active' : ''}`}
          onClick={() => handleClick('left')}
        >
          По участникам
        </div>
        <div
          className={`ratings-select_pt-variant ${selectedSide === 'right' ? 'active' : ''}`}
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
                <tr
                  key={participant.id}
                  onClick={() => handleUserClick(participant, index)}
                  className="cursor-pointer"
                >
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
              <div className="ratings-teams-list-team-item-team-progress flex-center-row">
                <div className="post__title-fire-count">{team.totalProgress}</div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="post__svg-icon"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.4006 27.6937C17.2411 28.0524 17.5086 28.4685 17.8968 28.411C22.6002 27.7139 25.5 23.5418 25.5 18.4992C25.5 15.9861 25.0965 12.13 22.3843 10.1754C22.2387 10.0705 22.0486 10.2362 22.1055 10.407C22.4411 11.4139 22.5 13.5 21.5 13.5C20.5 13.5 20.89 12.4781 20.6806 11.3092C20.5567 10.6172 20.4079 9.78662 20.0714 8.94027C19.2108 6.7753 17.5314 3.78656 12.6971 3.50027C12.5065 3.48898 12.3798 3.83213 12.4962 3.9845C13.9003 5.82401 14.5101 11.5 12.5 11.5C11.2779 11.5 11.4041 9.37078 12.1256 7.67401C12.1963 7.50762 12.0142 7.34151 11.8633 7.44003C6.92323 10.6652 6.5 15.9253 6.5 18.4992C6.5 23.5418 9.39983 27.7139 14.1032 28.411C14.4914 28.4685 14.7589 28.0524 14.5994 27.6937C14.1613 26.7084 13.7381 25.3583 13.7381 23.8689C13.7381 20.32 15.3235 18.7871 15.7965 18.044C15.8945 17.89 16.1055 17.89 16.2035 18.044C16.6765 18.7871 18.2619 20.32 18.2619 23.8689C18.2619 25.3583 17.8387 26.7084 17.4006 27.6937Z"
                    fill="url(#paint0_linear_1096_2207)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_1096_2207"
                      x1="6.5"
                      y1="28.5"
                      x2="27.9857"
                      y2="26.1412"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#9D9DE6" />
                      <stop offset="0.427083" stopColor="#567FE3" />
                      <stop offset="0.885417" stopColor="#9664C8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
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
      <PublicProfileModal
        user={selectedUser}
        isOpen={showPublicProfile}
        onClose={handleClosePublicProfile}
      />
    </div>
  )
}

export default Ratings
