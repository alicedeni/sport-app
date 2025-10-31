import React, { useState, useEffect } from 'react'
import { adminService } from '@shared/services/adminService'

const ErrorMonitoring = () => {
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const [errors, setErrors] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getTimeframeDates = () => {
    const now = new Date()
    let from = new Date()

    switch (selectedTimeframe) {
      case '1h':
        from.setHours(now.getHours() - 1)
        break
      case '24h':
        from.setDate(now.getDate() - 1)
        break
      case '7d':
        from.setDate(now.getDate() - 7)
        break
      case '30d':
        from.setDate(now.getDate() - 30)
        break
      default:
        from.setDate(now.getDate() - 1)
    }

    return {
      from: from.toISOString().split('T')[0],
      to: now.toISOString().split('T')[0],
    }
  }

  const loadErrors = async () => {
    setLoading(true)
    setError(null)
    try {
      const dates = getTimeframeDates()
      const params = {
        ...(selectedLevel !== 'all' && { level: selectedLevel }),
        from: dates.from,
        to: dates.to,
        page: 1,
        limit: 50,
      }

      const response = await adminService.getErrors(params)
      if (response.data.status === 200) {
        setErrors(response.data.data.errors || [])
        setPagination(response.data.data.pagination || null)
      } else {
        setError(response.data.error || response.data.message || 'Ошибка загрузки')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Ошибка при загрузке ошибок')
      console.error('Ошибка загрузки ошибок:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadErrors()
  }, [selectedLevel, selectedTimeframe])

  const levelOptions = [
    { value: 'all', label: 'Все уровни' },
    { value: 'error', label: 'Ошибки' },
    { value: 'warning', label: 'Предупреждения' },
    { value: 'info', label: 'Информация' },
  ]

  const timeframeOptions = [
    { value: '1h', label: 'Последний час' },
    { value: '24h', label: 'Последние 24 часа' },
    { value: '7d', label: 'Последние 7 дней' },
    { value: '30d', label: 'Последние 30 дней' },
  ]

  const filteredErrors = errors.filter(
    (err) => selectedLevel === 'all' || err.level === selectedLevel,
  )

  const getLevelBadge = (level) => {
    const levelConfig = {
      error: { text: 'Ошибка', class: 'admin-error-level--error' },
      warning: { text: 'Предупреждение', class: 'admin-error-level--warning' },
      info: { text: 'Информация', class: 'admin-error-level--info' },
    }
    const config = levelConfig[level] || levelConfig.error
    return <span className={`admin-error-level ${config.class}`}>{config.text}</span>
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      unresolved: { text: 'Не решена', class: 'admin-error-status--unresolved' },
      resolved: { text: 'Решена', class: 'admin-error-status--resolved' },
      investigating: { text: 'Расследуется', class: 'admin-error-status--investigating' },
    }
    const config = statusConfig[status] || statusConfig.unresolved
    return <span className={`admin-error-status ${config.class}`}>{config.text}</span>
  }

  const handleResolveError = async (errorId) => {
    try {
      const response = await adminService.updateErrorStatus(errorId, 'resolved')
      if (response.data.status === 200) {
        await loadErrors()
      } else {
        alert(response.data.error || response.data.message || 'Ошибка обновления статуса')
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Ошибка при обновлении статуса')
    }
  }

  const handleDeleteError = async (errorId) => {
    const updatedErrors = errors.filter((error) => error.id !== errorId)
    setErrors(updatedErrors)
  }

  const errorStats = {
    total: filteredErrors.length,
    unresolved: filteredErrors.filter((e) => e.status === 'unresolved' || !e.status).length,
    resolved: filteredErrors.filter((e) => e.status === 'resolved').length,
    investigating: filteredErrors.filter((e) => e.status === 'investigating').length,
  }

  return (
    <div className="admin-error-monitoring">
      <div className="admin-error-monitoring__header">
        <h1 className="admin-error-monitoring__title">Мониторинг ошибок</h1>
        {error && <div style={{ color: 'red', padding: '10px' }}>{error}</div>}
        <div className="admin-error-monitoring__controls">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="admin-select"
          >
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="admin-select"
          >
            {timeframeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>
      ) : (
        <>
          <div className="admin-error-stats">
            <div className="admin-error-stat">
              <div className="admin-error-stat__value">{errorStats.total}</div>
              <div className="admin-error-stat__label">Всего ошибок</div>
            </div>
            <div className="admin-error-stat admin-error-stat--unresolved">
              <div className="admin-error-stat__value">{errorStats.unresolved}</div>
              <div className="admin-error-stat__label">Не решены</div>
            </div>
            <div className="admin-error-stat admin-error-stat--resolved">
              <div className="admin-error-stat__value">{errorStats.resolved}</div>
              <div className="admin-error-stat__label">Решены</div>
            </div>
            <div className="admin-error-stat admin-error-stat--investigating">
              <div className="admin-error-stat__value">{errorStats.investigating}</div>
              <div className="admin-error-stat__label">Расследуются</div>
            </div>
          </div>

          <div className="admin-error-list">
            {filteredErrors.map((error) => (
              <div key={error.id} className="admin-error-item">
                <div className="admin-error-item__header">
                  <div className="admin-error-item__level">{getLevelBadge(error.level)}</div>
                  <div className="admin-error-item__status">{getStatusBadge(error.status)}</div>
                  <div className="admin-error-item__count">{error.count} раз</div>
                  <div className="admin-error-item__timestamp">{error.timestamp}</div>
                </div>

                <div className="admin-error-item__body">
                  <div className="admin-error-item__message">{error.message}</div>
                  <div className="admin-error-item__source">
                    Сервис: {error.service || error.source || 'N/A'}
                  </div>
                  {error.user && (
                    <div className="admin-error-item__user">Пользователь: {error.user}</div>
                  )}

                  {error.stack && (
                    <details className="admin-error-item__stack">
                      <summary>Стек вызовов</summary>
                      <pre className="admin-error-item__stack-content">{error.stack}</pre>
                    </details>
                  )}
                </div>

                <div className="admin-error-item__actions">
                  {error.status !== 'resolved' && (
                    <button
                      className="admin-btn admin-btn--small admin-btn--success"
                      onClick={() => handleResolveError(error.id)}
                    >
                      Отметить как решенную
                    </button>
                  )}
                  <button
                    className="admin-btn admin-btn--small admin-btn--danger"
                    onClick={() => handleDeleteError(error.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="admin-error-actions">
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Дополнительные действия (экспорт, очистка, уведомления) находятся в разработке
        </div>
      </div>
    </div>
  )
}

export default ErrorMonitoring
