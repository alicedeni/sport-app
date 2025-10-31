import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Notification from '@components/main/Notification.jsx'
import { CButtonProfile } from '@components/Buttons.jsx'
import LoadingSpinner from '@components/ui/LoadingSpinner.jsx'
import { useUser } from '@shared/hooks'
import {
  getDeclension,
  getAvatarBorderRadius,
  getInitials,
  getProgressBarBorderRadius,
} from '@shared/utils'
import { ROUTE_NAMES } from '@constants'

const Header = ({ currentPage }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const { userData, loading: loadingUser, hideWelcome } = useUser()
  const navigate = useNavigate()

  const {
    name: userName,
    avatar,
    points,
    goal,
    teams,
    participants,
    count,
    showWelcome: isNotificationOpen,
  } = userData

  const borderRadius = getAvatarBorderRadius(goal)
  const progressBorderRadius = getProgressBarBorderRadius(goal, false)

  const handlePageNotification = () => {
    hideWelcome()
  }

  if (loadingUser) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div
      className="header"
      style={{
        marginBottom: currentPage === 'feed' || currentPage === 'challenges' ? '100px' : '0',
      }}
    >
      <div className="header-title">
        СПОРТИВНЫЙ ЧЕЛЛЕНДЖ
        <CButtonProfile points={points}>
          {avatar ? (
            <img src={`${avatar}`} alt="User Avatar" className="avatar" />
          ) : (
            <div className="avatar-default">{getInitials(userName)}</div>
          )}
        </CButtonProfile>
      </div>
      <hr style={{ width: '100%', color: '$white', backgroundColor: '$white', height: '1px' }} />
      <nav className="header-nav">
        <div className="header-nav-list">
          <Link
            to={`/main`}
            className={`header-nav-list-item ${currentPage === ROUTE_NAMES.FEED ? 'active' : ''}`}
          >
            ЛЕНТА
          </Link>
          <Link
            to={`/challenges`}
            className={`header-nav-list-item ${currentPage === ROUTE_NAMES.CHALLENGES ? 'active' : ''}`}
          >
            ЧЕЛЛЕНДЖИ
          </Link>
          <Link
            to={`/ratings`}
            className={`header-nav-list-item ${currentPage === ROUTE_NAMES.RATINGS ? 'active' : ''}`}
          >
            РЕЙТИНГИ
          </Link>
          <Link
            to={`/activity`}
            className={`header-nav-list-item ${currentPage === ROUTE_NAMES.ACTIVITY ? 'active' : ''}`}
          >
            АКТИВНОСТЬ
          </Link>
        </div>
      </nav>
      {currentPage === ROUTE_NAMES.FEED && isNotificationOpen && (
        <Notification
          isOpen={isNotificationOpen}
          userName={userName}
          onClose={handlePageNotification}
        />
      )}
      {(currentPage === ROUTE_NAMES.CHALLENGES ||
        (currentPage === ROUTE_NAMES.FEED && !isNotificationOpen)) && (
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
                borderRadius: progressBorderRadius,
                display: goal === 0 ? 'none' : undefined,
              }}
            >
              {goal > 8 && <span className="goal-percentage">{goal.toFixed(0)}%</span>}
            </div>
          </div>
        </div>
      )}
      {currentPage === ROUTE_NAMES.FEED && !isNotificationOpen && (
        <div className="goal-info">
          <div className="goal-info__metrics">
            <span style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '10px' }}>
              {teams}
            </span>{' '}
            {getDeclension(teams, 'team')}
          </div>
          <div className="goal-info__metrics">
            <span style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '10px' }}>
              {participants}
            </span>{' '}
            {getDeclension(participants, 'participant')}
          </div>
          <div className="goal-info__metrics">
            <span style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '10px' }}>
              {count}
            </span>{' '}
            км пройдено
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
