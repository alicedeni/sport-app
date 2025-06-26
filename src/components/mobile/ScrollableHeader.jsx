import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { link } from '../../consts'

const ScrollableHeader = () => {
  const [goal, setGoal] = useState(0)
  const [mainInfo, setMainInfo] = useState({
    teams: 0,
    participants: 0,
    count: 0,
  })
  const [borderRadius, setBorderRadius] = useState('14px')
  const navigate = useNavigate()

  useEffect(() => {
    if (goal > 3 && goal < 7) {
      setBorderRadius('50%')
    } else {
      setBorderRadius('14px')
    }
  }, [goal])

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
    <div className="mobile-header">
      <div className="mobile-header__goal-status">
        <div className="mobile-header__goal-text">Наша цель — Прошагать 10 562 км.</div>
        <div className="mobile-header__goal-bar">
          <div
            className="mobile-header__goal"
            style={{ width: goal > 3 ? `${goal}%` : '0', borderRadius: borderRadius }}
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
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{mainInfo.count}</span> км пройдено
        </div>
      </div>
    </div>
  )
}

export default ScrollableHeader
