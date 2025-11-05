import React, { useState, useEffect } from 'react'
import { adminService } from '@shared/services/adminService'
import logger from '@shared/utils/logger'

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Всего пользователей', value: '0', change: '-', trend: 'neutral' },
    { title: 'Активные челленджи', value: '0', change: '-', trend: 'neutral' },
    { title: 'Завершенные активности', value: '0', change: '-', trend: 'neutral' },
    { title: 'Ошибки за неделю', value: '0', change: '-', trend: 'neutral' },
  ])
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const overviewResponse = await adminService.getStatsOverview()
        if (overviewResponse.data.status === 200) {
          const data = overviewResponse.data.data
          setStats([
            {
              title: 'Активных пользователей',
              value: (data.activeUsers || 0).toLocaleString(),
              change: '-',
              trend: 'neutral',
            },
            {
              title: 'Активные челленджи',
              value: 'N/A',
              change: '-',
              trend: 'neutral',
            },
            {
              title: 'Всего постов',
              value: (data.totalPosts || 0).toLocaleString(),
              change: '-',
              trend: 'neutral',
            },
            {
              title: 'Всего баллов',
              value: (data.totalPoints || 0).toLocaleString(),
              change: '-',
              trend: 'neutral',
            },
          ])
        }

        const recentResponse = await adminService.getDashboardRecentActivity({ limit: 20 })
        if (recentResponse.data.status === 200) {
          setRecentActivity(recentResponse.data.data.items || [])
        }
      } catch (err) {
        logger.error('Ошибка загрузки данных дашборда:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Панель управления</h1>
        <p className="admin-dashboard__subtitle">Обзор системы и ключевые метрики</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка данных...</div>
      ) : (
        <div className="admin-dashboard__stats">
          {stats.map((stat, index) => (
            <div key={index} className="admin-stat-card">
              <div className="admin-stat-card__content">
                <h3 className="admin-stat-card__title">{stat.title}</h3>
                <div className="admin-stat-card__value">{stat.value}</div>
                {stat.change !== '-' && (
                  <div className={`admin-stat-card__change admin-stat-card__change--${stat.trend}`}>
                    {stat.change}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-dashboard__grid">
        <div className="admin-dashboard__card">
          <h3 className="admin-dashboard__card-title">Последняя активность</h3>
          <div className="admin-activity-list">
            {recentActivity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Нет активности
              </div>
            ) : (
              recentActivity.map((item) => (
                <div key={`${item.type}-${item.id}`} className="admin-activity-item">
                  <div className="admin-activity-item__content">
                    <div className="admin-activity-item__user">{`${item.firstName || ''} ${item.lastName || ''}`}</div>
                    <div className="admin-activity-item__action">
                      {item.type === 'post' ? 'Опубликован пост' : 'Оставлен комментарий'} —{' '}
                      {item.preview}
                    </div>
                  </div>
                  <div className="admin-activity-item__time">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Раздел быстрых действий удалён */}
      </div>
    </div>
  )
}

export default AdminDashboard
