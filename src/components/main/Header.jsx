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

  const navigate = useNavigate()

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
          <div className="goal-text">Наша цель — Прошагать 402 км.</div>
          <div
            className="goal-bar"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{ position: 'relative' }}
          >
            <div className="goal" style={{ width: `${goal}%` }}>
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
            команды
          </div>
          <div className="goal-info__metrics">
            <span style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '10px' }}>
              {mainInfo.participants}
            </span>{' '}
            участников
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
