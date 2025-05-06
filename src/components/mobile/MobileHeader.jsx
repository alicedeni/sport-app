import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { link } from '../../consts'

const MobileHeader = () => {
  const [goal, setGoal] = useState(0)
  const [mainInfo, setMainInfo] = useState({
    teams: 0,
    participants: 0,
    count: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios
      .get(`${link}/main`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setGoal(response.data.goal)
        setMainInfo({
          teams: response.data.teams,
          participants: response.data.participants,
          count: response.data.count,
        })
      })
      .catch(() => navigate('/'))
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

  return (
    <div>
      <div className="mobile-header-fixed">
        <div className="mobile-header__title">СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ</div>
        <div className="mobile-header__line"></div>
      </div>
      <div className="mobile-header">
        <div className="mobile-header__goal-status">
          <div className="mobile-header__goal-text">Наша цель — Прошагать 402 км.</div>
          <div className="mobile-header__goal-bar">
            <div className="mobile-header__goal" style={{ width: `${goal}%` }}></div>
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
