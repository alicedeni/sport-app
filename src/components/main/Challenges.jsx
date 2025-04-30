import React, { useState, useEffect } from 'react'
import { ButtonActivity } from '../Buttons'
import ChallengeModal from './ChallengeModal'
import axios from 'axios'

import { link } from '../../consts.js'

const Challenges = () => {
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false)
  const [selectedSide, setSelectedSide] = useState('current')
  const [currentChallenges, setCurrentChallenges] = useState([])
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [incompletedChallenges, setIncompletedChallenges] = useState([])
  const [selectedChallengeId, setSelectedChallengeId] = useState(null)
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        let response
        const token = localStorage.getItem('token')
        if (selectedSide === 'current') {
          response = await axios.get(`${link}/user/current-challenges`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        } else {
          response = await axios.get(`${link}/user/completed-challenges`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        }
        if (isMounted) {
          const data = response.data
          if (data.status === 200) {
            if (selectedSide === 'current') {
              if (data.current_challenges) {
                setCurrentChallenges(fillChallenges(data.current_challenges || []))
              }
              setCurrentChallenges((prevChallenges) => [
                ...prevChallenges,
                {
                  id: 101,
                  name: 'Ежедневный бег 5 км',
                  description:
                    'Пробегайте 5 километров каждый день в течение недели, чтобы улучшить свою выносливость и здоровье.',
                  progress: 40,
                  points: 150,
                  image: 'https://storage.yandexcloud.net/team2go/users/base/testChallenge.png',
                },
              ])
            } else {
              setCompletedChallenges(data.completed_challenges || [])
              setIncompletedChallenges(data.incompleted_challenges || [])
            }
          } else {
            console.error('Data error:', data.message)
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error)
        }
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [selectedSide])

  const handleClick = (side) => {
    setSelectedSide(side)
  }

  const fillChallenges = (challenges, maxLength = 3) => {
    const emptyChallenge = { id: null, name: '', progress: 0, points: 0 }
    while (challenges.length < maxLength) {
      challenges.push({ ...emptyChallenge, id: challenges.length + 1 })
    }
    return challenges
  }

  const calculateCompletedPoints = () => {
    return completedChallenges
      .filter((challenge) => challenge.progress === 100)
      .reduce((total, challenge) => total + challenge.points, 0)
  }

  const handleChallengeClick = async (challengeId) => {
    setSelectedChallengeId(challengeId)
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${link}/user/select-challenge`,
        { challengeId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (response.data.status === 200) {
        console.log('Challenge selected successfully:', response.data.message)
      } else {
        console.error('Error selecting challenge:', response.data.message)
      }
    } catch (error) {
      console.error('Error selecting challenge:', error)
    }
  }

  const fetchCurrentChallenges = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${link}/user/current-challenges`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.status === 200) {
        setCurrentChallenges(fillChallenges(response.data.current_challenges || []))
        console.log('Current challenges:', response.data.message)
      } else {
        console.error('Data error:', response.data.message)
      }
    } catch (error) {
      console.error('Error fetching current challenges:', error)
    }
  }

  const handleOpenModal = (index) => {
    setSelectedChallengeIndex(index)
    setIsChallengeModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsChallengeModalOpen(false)
    fetchCurrentChallenges()
  }

  return (
    <div className="challenges">
      <div className="select_pt">
        <div
          className="select_pt-variant"
          style={{
            color: selectedSide === 'current' ? '#51B8FF' : '#808080',
            fontSize: selectedSide === 'current' ? '40px' : '32px',
            borderBottom: selectedSide === 'current' ? '2px solid #51B8FF' : 'none',
          }}
          onClick={() => handleClick('current')}
        >
          Текущие челленджи
        </div>
        <div
          className="select_pt-variant"
          style={{
            color: selectedSide === 'completed' ? '#51B8FF' : '#808080',
            fontSize: selectedSide === 'completed' ? '40px' : '32px',
            borderBottom: selectedSide === 'completed' ? '2px solid #51B8FF' : 'none',
          }}
          onClick={() => handleClick('completed')}
        >
          Выполненные челленджи
        </div>
      </div>
      {selectedSide === 'current' ? (
        <div className="current-challenges">
          {isChallengeModalOpen && <ChallengeModal onClose={handleCloseModal} />}
          <div className="metrics">
            Выбрано{' '}
            <span style={{ color: '#51B8FF' }}>
              {currentChallenges.filter((challenge) => challenge.name !== '').length}/3
            </span>
          </div>
          {currentChallenges.length > 0 ? (
            currentChallenges.map((challenge, index) =>
              challenge.name ? (
                <>
                  <div key={challenge.id} className="challenge-item__current">
                    <div className="challenge-items">
                      <div className="challenge-items__left">
                        <img
                          className="challenge-items-image"
                          src={`${challenge.image}`}
                          alt="challenge"
                        />
                      </div>
                      <div className="challenge-items__right">
                        <div className="challenge-item-text">
                          <h3 className="challenge-item-text-name">{challenge.name}</h3>
                          <div className="challenge-item-text-points">
                            {challenge.points} баллов
                          </div>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{ width: `${challenge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div key={challenge.id} className="challenge-item">
                    <div className="empty-challenge">
                      <div className="empty-challenge__text">
                        <p className="empty-challenge__text-p">Задание не выбрано</p>
                        <p className="empty-challenge__text-p">Доступно 6/6</p>
                      </div>
                      <ButtonActivity
                        className="welcome-block__btn"
                        text="Выбрать задание"
                        textContent={'Выбрать задание'}
                        onClick={() => handleOpenModal(index)}
                      ></ButtonActivity>
                    </div>
                  </div>
                </>
              ),
            )
          ) : (
            <div>No current challenges</div>
          )}
        </div>
      ) : (
        <div className="completed-challenges">
          <div className="metrics">
            Выполненные: <span style={{ color: '#51B8FF' }}>{completedChallenges.length}</span>
          </div>
          <div className="metrics">
            Незавершенные: <span style={{ color: '#51B8FF' }}>{incompletedChallenges.length}</span>
          </div>
          <div className="metrics">
            Заработано баллов:{' '}
            <span style={{ color: '#51B8FF' }}>{calculateCompletedPoints()}</span>
          </div>
          {completedChallenges.length > 0 ? (
            completedChallenges.map((challenge) => (
              <div key={challenge.id} className="challenge-item">
                <div className="challenge-item-text">
                  <h3 className="challenge-item-text-name">{challenge.name}</h3>
                  <div
                    className="challenge-item-text-points"
                    style={{
                      color: '#51B8FF',
                      backgroundColor: 'rgba(81, 184, 255, 0.2)',
                    }}
                  >
                    {challenge.points} баллов
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${challenge.progress}%` }}></div>
                </div>
              </div>
            ))
          ) : (
            <div>No completed challenges</div>
          )}
          <div className="challenge-line"></div>
          {incompletedChallenges.length > 0 ? (
            incompletedChallenges.map((challenge) => (
              <div key={challenge.id} className="challenge-item">
                <div className="challenge-item-text" style={{ opacity: 0.7 }}>
                  <h3 className="challenge-item-text-name" style={{ opacity: 0.7 }}>
                    {challenge.name}
                  </h3>
                  <div
                    className="challenge-item-text-points"
                    style={{
                      color: '#FF4D53',
                      backgroundColor: 'rgba(255, 77, 83, 0.2)',
                      opacity: 0.7,
                    }}
                  >
                    {challenge.points} баллов
                  </div>
                </div>
                <div className="progress-bar" style={{ opacity: 0.7 }}>
                  <div
                    className="progress"
                    style={{ width: `${challenge.progress}%`, opacity: 0.7 }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  )
}

export default Challenges
