import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Notification from './Notification'
import { CButtonProfile } from '../Buttons'
import axios from 'axios'
import { link } from '../../consts.js'
import { TailSpin } from 'react-loader-spinner'

const Header = ({ currentPage }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(true)
  const [userName, setUserName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [points, setPoints] = useState(0)
  const [goal, setGoal] = useState(0)
  const [loadingUser, setLoadingUser] = useState(true)
  const [mainInfo, setMainInfo] = useState({ teams: 0, participants: 0, count: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const [borderRadius, setBorderRadius] = useState('28px')

  const navigate = useNavigate()

  useEffect(() => {
    if (goal > 0 && goal < 5) {
      setBorderRadius('50%')
    } else {
      setBorderRadius('28px')
    }
  }, [goal])

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios
      .get(`${link}/main`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setUserName(response.data.name)
        setAvatar(response.data.avatar)
        setPoints(response.data.points)
        setGoal(response.data.goal)
        setMainInfo({
          teams: response.data.teams,
          participants: response.data.participants,
          count: response.data.count,
        })
        setIsNotificationOpen(response.data.show_welcome)
      })
      .catch(() => navigate('/'))
      .finally(() => setLoadingUser(false))

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          navigate('/')
        }
        return Promise.reject(error)
      },
    )

    return () => axios.interceptors.response.eject(interceptor)
  }, [navigate])

  const handlePageNotification = () => {
    setIsNotificationOpen(false)
    const token = localStorage.getItem('token')
    axios
      .post(`${link}/hide_welcome`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {})
      .catch((error) => {
        console.error('Ошибка при скрытии подсказки:', error)
      })
  }

  const getDeclension = (count, wordType) => {
    const words = {
      participant: ['участник', 'участника', 'участников'],
      team: ['команда', 'команды', 'команд'],
    }

    if (!words[wordType]) {
      return ''
    }

    const cases = [2, 0, 1, 1, 1, 2]
    const mod100 = count % 100

    if (mod100 >= 11 && mod100 <= 14) {
      return words[wordType][2]
    }

    const mod10 = count % 10

    return words[wordType][cases[mod10 < 5 ? mod10 : 5]]
  }

  if (loadingUser) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <TailSpin height="80" width="80" color="white" ariaLabel="loading" />
      </div>
    )
  }

  return (
    <div
      className="header"
      style={{
        marginBottom: currentPage === 'feed' || currentPage === 'challenges' ? '100px' : '0',
      }}
    >
      <div className="header-title">
        СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ
        <CButtonProfile points={points}>
          {avatar ? (
            <img src={`${avatar}`} alt="User Avatar" className="avatar" />
          ) : (
            <div className="avatar-default">{userName ? userName.charAt(0) : ''}</div>
          )}
        </CButtonProfile>
      </div>
      <hr style={{ width: '100%', color: '$white', backgroundColor: '$white', height: '1px' }} />
      <nav className="header-nav">
        <div className="header-nav-list">
          <Link
            to={`/main`}
            className={`header-nav-list-item ${currentPage === 'feed' ? 'active' : ''}`}
          >
            ЛЕНТА
          </Link>
          <Link
            to={`/challenges`}
            className={`header-nav-list-item ${currentPage === 'challenges' ? 'active' : ''}`}
          >
            ЧЕЛЛЕНДЖИ
          </Link>
          <Link
            to={`/ratings`}
            className={`header-nav-list-item ${currentPage === 'ratings' ? 'active' : ''}`}
          >
            РЕЙТИНГИ
          </Link>
          <Link
            to={`/activity`}
            className={`header-nav-list-item ${currentPage === 'activity' ? 'active' : ''}`}
          >
            АКТИВНОСТЬ
          </Link>
        </div>
      </nav>
      {currentPage === 'feed' && isNotificationOpen && (
        <Notification
          isOpen={isNotificationOpen}
          userName={userName}
          onClose={handlePageNotification}
        />
      )}
      {(currentPage === 'challenges' || (currentPage === 'feed' && !isNotificationOpen)) && (
        <div className="goal-status">
          <div className="goal-text">Наша цель — Прошагать 10 562 км.</div>
          <div
            className="goal-bar"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{ position: 'relative' }}
          >
            <div
              className="goal"
              style={{
                width: goal > 0 ? `${goal}%` : '0',
                borderRadius: borderRadius,
                display: goal === 0 ? 'none' : undefined,
              }}
            >
              {goal > 8 && <span className="goal-percentage">{goal.toFixed(0)}%</span>}
            </div>
          </div>
        </div>
      )}
      {currentPage === 'feed' && !isNotificationOpen && (
        <div className="goal-info">
          <div className="goal-info__metrics">
            <span style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '10px' }}>
              {mainInfo.teams}
            </span>{' '}
            {getDeclension(mainInfo.participants, 'team')}
          </div>
          <div className="goal-info__metrics">
            <span style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '10px' }}>
              {mainInfo.participants}
            </span>{' '}
            {getDeclension(mainInfo.participants, 'participant')}
          </div>
          <div className="goal-info__metrics">
            <span style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '10px' }}>
              {mainInfo.count}
            </span>{' '}
            км пройдено
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
