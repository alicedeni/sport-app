import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { link } from '../../consts.js'

const Checkmark = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4CAF50"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const Challenges = () => {
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false)
  const [selectedSide, setSelectedSide] = useState('current')
  const [currentChallenges, setCurrentChallenges] = useState([])
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [incompletedChallenges, setIncompletedChallenges] = useState([])
  const [selectedChallengeId, setSelectedChallengeId] = useState(null)
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState(null)
  const [statuses, setStatuses] = useState({})
  const [user, setUser] = useState(null)
  const challengesData = [
    {
      id: 1,
      name: 'Скороход',
      points: 300,
      description: 'Пройди 75000 шагов за 5 дней',
      image: 'https://storage.yandexcloud.net/team2go/users/base/challenge-personal-walk.png',
    },
    {
      id: 2,
      name: 'Командный LooC-бег',
      points: 1000,
      description: 'Проведите совместную пробежку в формате видеоконференции (30 мин минимум)',
      image: 'https://storage.yandexcloud.net/team2go/users/base/challenge-team-run.png',
    },
    {
      id: 3,
      name: 'Творческая команда',
      points: 1000,
      description: 'Сделайте командный видеоролик о здоровом образе жизни',
      image: 'https://storage.yandexcloud.net/team2go/users/base/challeng-team-creative.png',
    },
  ]
  const [participating, setParticipating] = useState({})

  const handleParticipate = async (challengeId) => {
    if (!user) return

    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${link}/api/user_challenge_statuses/participate`,
        {
          user_id: user.id,
          challenge_id: challengeId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.data.status === 200) {
        setStatuses((prev) => ({
          ...prev,
          [challengeId]: 'участвует',
        }))
      }
    } catch (error) {
      console.error('Ошибка при участии в челлендже', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    axios
      .get(`${link}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data && res.data.profile) {
          setUser(res.data.profile)
          console.log(res.data.profile)
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!user) return

    const token = localStorage.getItem('token')
    axios
      .get(`${link}/api/user_challenge_statuses`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id: user.id },
      })
      .then((res) => {
        if (res.data.status === 200 && res.data.data) {
          const arr = res.data.data
          setStatuses({
            1: arr[0],
            2: arr[1],
            3: arr[2],
          })
        }
      })
      .catch(console.error)
  }, [user])

  const renderStatus = (status, challengeId) => {
    switch (status) {
      case 'участвует':
        return (
          <div className="participating-status" style={{ color: '#2196f3' }}>
            Участвую!
          </div>
        )
      case 'выполнено':
        return (
          <div className="participating-status">
            Выполнено <Checkmark />
          </div>
        )
      default:
        return (
          <button className="participate-button" onClick={() => handleParticipate(challengeId)}>
            Участвовать
          </button>
        )
    }
  }

  return (
    <div className="challenges empty-state">
      <div className="current-challenges">
        {challengesData.map((challenge) => (
          <div key={challenge.id} className="challenge-item__current">
            <div className="challenge-items">
              <div className="challenge-items__left">
                <img className="challenge-items-image" src={challenge.image} alt={challenge.name} />
              </div>
              <div className="challenge-items__right">
                <div className="challenge-item-text">
                  <h3 className="challenge-item-text-name">{challenge.name}</h3>
                  <div className="challenge-item-text-points">{challenge.points} баллов</div>
                </div>
                <p className="challenge-item-description">{challenge.description}</p>
                <div className="challenge-item-st">
                  {renderStatus(statuses[challenge.id], challenge.id)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Challenges
