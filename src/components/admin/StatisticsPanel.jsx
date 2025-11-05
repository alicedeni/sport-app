import React, { useState, useEffect } from 'react'
import { adminService } from '@shared/services/adminService'

const StatisticsPanel = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [overviewStats, setOverviewStats] = useState(null)
  const [participantsRating, setParticipantsRating] = useState([])
  const [teamsRating, setTeamsRating] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [exportScope, setExportScope] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const overviewResponse = await adminService.getStatsOverview({
        interval: selectedPeriod,
        ...(selectedPeriod !== 'all' && {
          from: getPeriodStartDate(selectedPeriod),
          to: new Date().toISOString().split('T')[0],
        }),
      })
      if (overviewResponse.data.status === 200) {
        setOverviewStats(overviewResponse.data.data)
      }

      const ratingResponse = await adminService.getParticipantsRating()
      if (ratingResponse.data.status === 200) {
        setParticipantsRating(ratingResponse.data.data.leaderboard || [])
      }

      const teamsResponse = await adminService.getTeamsRating()
      if (teamsResponse.data.status === 200) {
        setTeamsRating(teamsResponse.data.data.leaderboard || [])
      }

      const metricsResponse = await adminService.getMetrics({
        interval: selectedPeriod,
        ...(selectedPeriod !== 'all' && {
          from: getPeriodStartDate(selectedPeriod),
          to: new Date().toISOString().split('T')[0],
        }),
      })
      if (metricsResponse.data.status === 200) {
        setMetrics(metricsResponse.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Ошибка загрузки статистики')
      console.error('Ошибка загрузки статистики:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPeriodStartDate = (period) => {
    const now = new Date()
    let start = new Date()

    switch (period) {
      case 'week':
        start.setDate(now.getDate() - 7)
        break
      case 'month':
        start.setMonth(now.getMonth() - 1)
        break
      case 'year':
        start.setFullYear(now.getFullYear() - 1)
        break
      default:
        start = now
    }

    return start.toISOString().split('T')[0]
  }

  useEffect(() => {
    loadStats()
  }, [selectedPeriod])

  const periodOptions = [
    { value: 'all', label: 'За всё время' },
    { value: 'day', label: 'День' },
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
  ]

  return (
    <div className="admin-statistics">
      <div className="admin-statistics__header">
        <h1 className="admin-statistics__title">Статистика и рейтинги</h1>
        <div className="admin-statistics__controls">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="admin-select"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-statistics__grid">
        <div className="admin-statistics__card">
          <h3 className="admin-statistics__card-title">Рейтинг команд</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>
          ) : teamsRating.length > 0 ? (
            <div className="admin-team-leaderboard">
              {teamsRating.map((team, index) => (
                <div key={team.id || index} className="admin-team-item">
                  <div className="admin-team-item__rank">#{index + 1}</div>
                  <div className="admin-team-item__info">
                    <div className="admin-team-item__name">{team.name}</div>
                    <div className="admin-team-item__members">{team.members || 0} участников</div>
                  </div>
                  <div className="admin-team-item__stats">
                    <div className="admin-team-item__points">{team.totalProgress || 0} баллов</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>Нет данных</div>
          )}
        </div>

        <div className="admin-statistics__card">
          <h3 className="admin-statistics__card-title">Топ пользователей</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>
          ) : participantsRating.length > 0 ? (
            <div className="admin-user-leaderboard">
              {participantsRating.slice(0, 10).map((user, index) => (
                <div key={user.id || index} className="admin-leaderboard-item">
                  <div className="admin-leaderboard-item__rank">#{index + 1}</div>
                  <div className="admin-leaderboard-item__info">
                    <div className="admin-leaderboard-item__name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="admin-leaderboard-item__team">{user.league || '-'}</div>
                  </div>
                  <div className="admin-leaderboard-item__stats">
                    <div className="admin-leaderboard-item__points">
                      {user.progress || 0} баллов
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>Нет данных</div>
          )}
        </div>

        <div className="admin-statistics__card">
          <h3 className="admin-statistics__card-title">Общая статистика</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>
          ) : error ? (
            <div style={{ color: 'red', padding: '10px' }}>{error}</div>
          ) : overviewStats ? (
            <div className="admin-overview-stats">
              <div className="admin-overview-stat">
                <div className="admin-overview-stat__value">{overviewStats.activeUsers || 0}</div>
                <div className="admin-overview-stat__label">Активных пользователей</div>
              </div>
              <div className="admin-overview-stat">
                <div className="admin-overview-stat__value">{overviewStats.totalPosts || 0}</div>
                <div className="admin-overview-stat__label">Всего постов</div>
              </div>
              <div className="admin-overview-stat">
                <div className="admin-overview-stat__value">{overviewStats.totalPoints || 0}</div>
                <div className="admin-overview-stat__label">Всего баллов</div>
              </div>
              <div className="admin-overview-stat">
                <div className="admin-overview-stat__value">{overviewStats.totalCalories || 0}</div>
                <div className="admin-overview-stat__label">Всего калорий</div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>Нет данных</div>
          )}
        </div>
      </div>

      <div className="admin-statistics__actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <select
            value={exportScope}
            onChange={(e) => setExportScope(e.target.value)}
            className="admin-select"
          >
            <option value="overview">Итоги</option>
            <option value="participants">Участники</option>
            <option value="teams">Команды</option>
            <option value="activities">Активности</option>
          </select>
          <button
            className="admin-btn admin-btn--primary"
            onClick={async () => {
              try {
                const params = {
                  scope: exportScope,
                  format: 'csv',
                }
                params.interval = selectedPeriod
                if (selectedPeriod !== 'all') {
                  params.from = getPeriodStartDate(selectedPeriod)
                  params.to = new Date().toISOString().split('T')[0]
                }
                const res = await adminService.exportStats(params)
                const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
                link.setAttribute('download', `stats_${exportScope}_${stamp}.csv`)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
              } catch (err) {
                alert(err.response?.data?.error || err.message || 'Ошибка экспорта')
              }
            }}
          >
            Экспорт CSV
          </button>
          <button
            className="admin-btn admin-btn--secondary"
            onClick={async () => {
              if (window.confirm('Вы уверены, что хотите пересчитать статистику?')) {
                try {
                  const response = await adminService.recalculateStats({ scope: 'all' })
                  if (response.data.status === 200) {
                    alert('Статистика пересчитана успешно')
                    await loadStats()
                  }
                } catch (err) {
                  alert(err.response?.data?.error || err.message || 'Ошибка пересчета статистики')
                }
              }
            }}
          >
            Пересчитать статистику
          </button>
          <button
            className="admin-btn admin-btn--secondary"
            onClick={async () => {
              if (window.confirm('Пересчитать лиги для всех пользователей?')) {
                try {
                  const response = await adminService.recalculateLeagues()
                  if (response.data.status === 200) {
                    alert('Лиги пересчитаны успешно')
                    await loadStats()
                  }
                } catch (err) {
                  alert(err.response?.data?.error || err.message || 'Ошибка пересчета лиг')
                }
              }
            }}
          >
            Пересчитать лиги
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatisticsPanel
