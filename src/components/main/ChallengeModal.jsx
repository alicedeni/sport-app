import React, { useEffect, useState } from 'react'
import { ButtonChallenge } from '../Buttons'
import axios from 'axios'
import { link } from '../../consts.js'

const ChallengeModal = ({ onClose }) => {
  const [challenges, setChallenges] = useState([])

  useEffect(() => {
    const fetchChallenges = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get(`${link}/user/available-challenges`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.data.status === 200) {
          setChallenges(response.data.available_challenges || [])
        } else {
          console.error('Error fetching challenges:', response.data.message)
        }
      } catch (error) {
        console.error('Error fetching challenges:', error)
      }
    }

    fetchChallenges()
  }, [])

  const handleSelectChallenge = async (challengeId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${link}/user/select-challenge`,
        { challengeId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (response.data.status === 200) {
        console.log('Challenge selected successfully:', response.data.message)
        onClose()
      } else {
        console.error('Error selecting challenge:', response.data.message)
      }
    } catch (error) {
      console.error('Error selecting challenge:', error)
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
