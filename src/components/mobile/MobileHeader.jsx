import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '@shared/services/api'
import { getProgressBarBorderRadius } from '@shared/utils'

const MobileHeader = () => {
  const [goal, setGoal] = useState(0)
  const [mainInfo, setMainInfo] = useState({
    teams: 0,
    participants: 0,
    count: 0,
  })
  const [borderRadius, setBorderRadius] = useState('14px')
  const navigate = useNavigate()

  useEffect(() => {
    setBorderRadius(getProgressBarBorderRadius(goal, true))
  }, [goal])

  useEffect(() => {
    api
      .get('/main')
      .then((response) => {
        setGoal(response.data.goal)
        setMainInfo({
          teams: response.data.teams,
          participants: response.data.participants,
          count: response.data.count,
        })
      })
      .catch(() => navigate('/'))
  }, [navigate])

  return (
    <div>
      <div className="mobile-header-fixed">
        <div className="mobile-header__title">СПОРТИВНЫЙ ЧЕЛЛЕНДЖ</div>
        <div className="mobile-header__line"></div>
      </div>
      <div className="mobile-header">
        <div className="mobile-header__goal-status">
          <div className="mobile-header__goal-text">Наша цель — Прошагать 10 562 км.</div>
          <div className="mobile-header__goal-bar">
            <div
              className="mobile-header__goal"
              style={{ width: goal > 0 ? `${Math.max(goal, 3)}%` : '0', borderRadius: borderRadius }}
            ></div>
          </div>
        </div>

        <div className="mobile-goal-info">
          <div className="mobile-goal-info__metrics">
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{mainInfo.teams}</span> команды
          </div>
          <div className="mobile-goal-info__metrics">
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{mainInfo.participants}</span>{' '}
            участников
          </div>
          <div className="mobile-goal-info__metrics">
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{mainInfo.count}</span> км
            пройдено
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileHeader
