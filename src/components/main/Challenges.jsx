import React, { useState, useEffect, useMemo, useRef } from 'react'
import { challengeService } from '@shared/services/challengeService'
import logger from '@shared/utils/logger'
import SafeText from '@shared/components/SafeText'

const metricLabel = (m) => {
  switch (m) {
    case 'distance':
      return 'км'
    case 'calories':
      return 'ккал'
    case 'points':
      return 'баллов'
    case 'steps':
      return 'шагов'
    case 'duration':
      return 'ч'
    default:
      return ''
  }
}

const formatMetricValue = (value, metricType = 'points') => {
  if (value == null || value === '') {
    return '-'
  }

  if (metricType === 'duration') {
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) {
      return `${value}`
    }
    const totalMinutes = Math.round(numericValue * 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.abs(totalMinutes % 60)
    return `${hours}ч ${minutes.toString().padStart(2, '0')}м`
  }

  const numericValue = Number(value)
  if (Number.isNaN(numericValue)) {
    return `${value}`
  }

  if (metricType === 'distance') {
    return numericValue.toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

  return numericValue.toLocaleString('ru-RU')
}

const formatDeadline = (endAt) => {
  if (!endAt) return '-'
  const end = new Date(endAt)
  const now = new Date()
  const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Завершён'
  if (days === 0) return 'Заканчивается сегодня!'
  if (days === 1) return 'Остался 1 день'
  return `Осталось ${days} дней`
}

const Challenges = () => {
  const [status, setStatus] = useState('active')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [challenges, setChallenges] = useState([])
  const [joiningId, setJoiningId] = useState(null)
  const abortRef = useRef(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller
      let res
      if (status === 'completed') {
        res = await challengeService.getMyChallenges({ status: 'completed' })
      } else {
        const params = { status, page: 1, limit: 50 }
        res = await challengeService.getChallenges(params)
      }
      if (res.data.status === 200) {
        const payload = res.data?.data || res.data
        setChallenges(payload.challenges || [])
      } else {
        setError(res.data.error || res.data.message || 'Ошибка загрузки челленджей')
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError(err.response?.data?.error || err.message || 'Ошибка при загрузке челленджей')
        logger.error('Ошибка загрузки челленджей:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    return () => abortRef.current?.abort()
  }, [status])

  const onJoin = async (id) => {
    if (joiningId) return
    setJoiningId(id)
    try {
      const res = await challengeService.joinChallenge(id)
      if (res.data.status === 200) {
        await load()
      }
    } catch (e) {
    } finally {
      setJoiningId(null)
    }
  }

  const handleParticipate = onJoin

  const Checkmark = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0a6b3e"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )

  const renderStatus = (joined, completed, rewardGranted, challengeId) => {
    if (completed) {
      return (
        <div className="participating-status">
          Выполнено <Checkmark />
        </div>
      )
    }
    if (joined) {
      return <div className="participating-status blue-text">Участвую!</div>
    }
    return (
      <button
        className="participate-button"
        disabled={joiningId === challengeId}
        onClick={() => handleParticipate(challengeId)}
      >
        {joiningId === challengeId ? '...' : 'Участвовать'}
      </button>
    )
  }

  const list = useMemo(() => challenges || [], [challenges])

  return (
    <div className="challenges">
      {loading && <div className="challenges-loading">Загрузка...</div>}
      {error && !loading && <div className="challenges-error">{error}</div>}
      {!loading && !error && (
        <div className="current-challenges">
          {list.length === 0 ? (
            <div className="challenges-empty">Нет челленджей</div>
          ) : (
            list.map((ch) => {
              const joined = ch.my_progress?.joined === true
              const completed = ch.my_progress?.completed === true
              const rewardGranted = ch.my_progress?.reward_granted === true
              const percentage = Math.min(
                100,
                Math.max(0, Math.round(ch.my_progress?.percentage || 0)),
              )
              const metricType = ch.metric_type || ch.metricType || 'points'
              const currentValue = formatMetricValue(
                ch.my_progress?.current_value ?? ch.my_progress?.currentValue,
                metricType,
              )
              const targetValue = formatMetricValue(
                ch.target_value ?? ch.targetValue ?? ch.goal_value ?? ch.goalValue,
                metricType,
              )
              const showMetricDetails =
                metricType && (currentValue !== '-' || targetValue !== '-') && joined

              return (
                <div key={ch.id} className="challenge-item__current">
                  <div className="challenge-items">
                    <div className="challenge-items__left">
                      {ch.cover_image && (
                        <img className="challenge-items-image" src={ch.cover_image} alt={ch.name} />
                      )}
                    </div>
                    <div className="challenge-items__right">
                      <div className="challenge-items__right-topic">
                        <div className="challenge-item-text">
                          <div className="challenge-item-text__left">
                            <h3 className="challenge-item-text-name">{ch.name}</h3>
                            <div
                              className={`challenge-item-text-points${
                                rewardGranted ? ' challenge-item-text-points--rewarded' : ''
                              }`}
                            >
                              {ch.reward_points || 0} баллов
                            </div>
                          </div>
                          <div className="challenge-item-text-meta">
                            <div className="challenge-item-text-deadline">
                              {formatDeadline(ch.end_at || ch.endAt)}
                            </div>
                            {ch.participants_count != null && (
                              <div className="challenge-item-text-participants">
                                <img
                                  src="https://storage.yandexcloud.net/team2go/users/base/iconPerson.png"
                                  alt="participants"
                                  className="challenge-item-text-participants-icon"
                                />
                                <span className="challenge-item-text-participants-count">
                                  {ch.participants_count}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {ch.description && (
                          <div className="challenge-item-description">
                            <SafeText text={ch.description} />
                          </div>
                        )}
                      </div>
                      {renderStatus(joined, completed, rewardGranted, ch.id)}
                      {(joined || completed) && (
                        <div className="challenge-item-progress-wrapper">
                          <div className="progress-bar progress-bar-margin-top">
                            <div className="progress" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default Challenges
