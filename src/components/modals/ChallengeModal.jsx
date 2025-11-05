import React, { useEffect, useState } from 'react'
import { ButtonChallenge } from '@components/Buttons.jsx'
import api from '@shared/services/api'
import logger from '@shared/utils/logger'

const ChallengeModal = ({ onClose }) => {
  const [challenges, setChallenges] = useState([])

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.get('/user/available-challenges')
        if (response.data.status === 200) {
          setChallenges(response.data.available_challenges || [])
        } else {
          logger.error('Error fetching challenges:', response.data.message)
        }
      } catch (error) {
        logger.error('Error fetching challenges:', error)
      }
    }

    fetchChallenges()
  }, [])

  const handleSelectChallenge = async (challengeId) => {
    try {
      const response = await api.post('/user/select-challenge', { challengeId })
      if (response.data.status === 200) {
        onClose()
      } else {
        logger.error('Error selecting challenge:', response.data.message)
      }
    } catch (error) {
      logger.error('Error selecting challenge:', error)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          <img
            src="https://storage.yandexcloud.net/team2go/users/base/closeDefault.svg"
            className="close-img"
          />
        </span>
        <div className="content-challenge">
          <h2>Доступные челленджи</h2>
          <ul className="challenge-list">
            {challenges.map((challenge, index) => (
              <li
                key={challenge.id}
                className={`challenge-list-item ${
                  index !== challenges.length - 1 ? 'with-divider' : ''
                }`}
              >
                <div className="challenge-info">
                  <div className="challenge-index">{index + 1}</div>
                  <div className="challenge-text">
                    <p className="challenge-name">{challenge.name}</p>
                    <p className="challenge-points">{challenge.points} баллов</p>
                  </div>
                </div>
                <ButtonChallenge
                  className="welcome-block__btn"
                  text="Выбрать задание"
                  textContent="Выбрать задание"
                  onClick={() => handleSelectChallenge(challenge.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ChallengeModal
