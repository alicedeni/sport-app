import React, { useState, useEffect } from 'react'
import { adminService } from '@shared/services/adminService'
import PlaceholderModal from '@components/admin/PlaceholderModal.jsx'
import Modal from '@shared/ui/Modal'
import logger from '@shared/utils/logger'

const ChallengeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [leagueFilter, setLeagueFilter] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [infoModal, setInfoModal] = useState({ open: false, message: '' })
  const [saving, setSaving] = useState(false)

  const loadChallenges = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        page,
        limit,
        ...(statusFilter && { status: statusFilter }),
        ...(leagueFilter && { league: leagueFilter }),
      }

      const response = await adminService.getChallenges(params)
      if (response.data.status === 200) {
        setChallenges(response.data.data.challenges || [])
        setPagination(response.data.data.pagination || null)
      } else {
        setError(response.data.error || response.data.message || 'Ошибка загрузки челленджей')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Ошибка при загрузке челленджей')
      logger.error('Ошибка загрузки челленджей:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChallenges()
  }, [page, statusFilter, leagueFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        loadChallenges()
      } else {
        setPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditChallenge = (challenge) => {
    setEditingChallenge(challenge)
  }

  const handleDeleteChallenge = async (challengeId) => {
    setConfirmDeleteId(challengeId)
  }

  const confirmDelete = async () => {
    if (!confirmDeleteId) return
    setSaving(true)
    try {
      const response = await adminService.deleteChallenge(confirmDeleteId)
      if (response.data.status === 200) {
        setInfoModal({ open: true, message: 'Челлендж успешно удален.' })
        await loadChallenges()
      } else {
        setInfoModal({ open: true, message: response.data.error || response.data.message || 'Ошибка удаления челленджа' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при удалении челленджа' })
    } finally {
      setConfirmDeleteId(null)
      setSaving(false)
    }
  }

  const handleToggleStatus = async (challengeId) => {
    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge) return

    let newStatus = 'active'
    if (challenge.status === 'active') {
      newStatus = 'archived'
    } else if (challenge.status === 'archived' || challenge.status === 'draft') {
      newStatus = 'active'
    }

    try {
      const response = await adminService.updateChallengeStatus(challengeId, newStatus)
      if (response.data.status === 200) {
        await loadChallenges()
      } else {
        setInfoModal({ open: true, message: response.data.error || response.data.message || 'Ошибка изменения статуса' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при изменении статуса' })
    }
  }

  const handleSaveChallenge = async (challengeData) => {
    try {
      let response
      if (editingChallenge?.id) {
        response = await adminService.updateChallenge(editingChallenge.id, challengeData)
      } else {
        response = await adminService.createChallenge(challengeData)
      }

      if (response.data.status === 200) {
        setEditingChallenge(null)
        setShowAddModal(false)
        await loadChallenges()
      } else {
        setInfoModal({ open: true, message: response.data.error || response.data.message || 'Ошибка сохранения челленджа' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при сохранении челленджа' })
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { text: 'Активен', class: 'admin-challenge-status--active' },
      draft: { text: 'Черновик', class: 'admin-challenge-status--paused' },
      archived: { text: 'Архивирован', class: 'admin-challenge-status--completed' },
      paused: { text: 'Приостановлен', class: 'admin-challenge-status--paused' },
      completed: { text: 'Завершен', class: 'admin-challenge-status--completed' },
    }
    const config = statusConfig[status] || statusConfig.active
    return <span className={`admin-challenge-status ${config.class}`}>{config.text}</span>
  }

  const getTypeIcon = (type) => {
    const typeIcons = {
      running: '🏃',
      swimming: '🏊',
      cycling: '🚴',
      yoga: '🧘',
      gym: '💪',
    }
    return typeIcons[type] || '🏆'
  }

  return (
    <div className="admin-challenge-management">
      <div className="admin-challenge-management__header">
        <h1 className="admin-challenge-management__title">Управление челленджами</h1>
        <div className="admin-challenge-management__actions">
          <div className="admin-search">
            <input
              type="text"
              placeholder="Поиск челленджей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search__input"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">Все статусы</option>
            <option value="draft">Черновики</option>
            <option value="active">Активные</option>
            <option value="archived">Архивированные</option>
          </select>
          <select
            value={leagueFilter}
            onChange={(e) => setLeagueFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">Все лиги</option>
            <option value="bronze">Бронзовая</option>
            <option value="silver">Серебряная</option>
            <option value="gold">Золотая</option>
          </select>
          <button className="admin-btn admin-btn--primary" onClick={() => setShowAddModal(true)}>
            + Создать челлендж
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-error-message" style={{ color: 'red', padding: '10px' }}>
          {error}
        </div>
      )}

      {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>}

      {!loading && (
        <>
          <div className="admin-challenge-grid">
            {filteredChallenges.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Челленджи не найдены</div>
            ) : (
              filteredChallenges.map((challenge) => (
                <div key={challenge.id} className="admin-challenge-card">
                  <div className="admin-challenge-card__header">
                    <div className="admin-challenge-card__icon">{getTypeIcon(challenge.type)}</div>
                    <div className="admin-challenge-card__title">
                      {challenge.name || challenge.title}
                    </div>
                    {getStatusBadge(challenge.status)}
                  </div>

                  <div className="admin-challenge-card__body">
                    <p className="admin-challenge-card__description">{challenge.description}</p>

                    <div className="admin-challenge-card__stats">
                      <div className="admin-challenge-stat">
                        <span className="admin-challenge-stat__label">Баллы:</span>
                        <span className="admin-challenge-stat__value">{challenge.points || 0}</span>
                      </div>
                      <div className="admin-challenge-stat">
                        <span className="admin-challenge-stat__label">Лига:</span>
                        <span className="admin-challenge-stat__value">
                          {challenge.league || '-'}
                        </span>
                      </div>
                      <div className="admin-challenge-stat">
                        <span className="admin-challenge-stat__label">Участники:</span>
                        <span className="admin-challenge-stat__value">
                          {challenge.participantsCount || 0}
                        </span>
                      </div>
                    </div>

                    <div className="admin-challenge-card__dates">
                      <div className="admin-challenge-date">
                        <span className="admin-challenge-date__label">Начало:</span>
                        <span className="admin-challenge-date__value">
                          {challenge.startAt
                            ? new Date(challenge.startAt).toLocaleDateString()
                            : challenge.startDate || '-'}
                        </span>
                      </div>
                      <div className="admin-challenge-date">
                        <span className="admin-challenge-date__label">Окончание:</span>
                        <span className="admin-challenge-date__value">
                          {challenge.endAt
                            ? new Date(challenge.endAt).toLocaleDateString()
                            : challenge.endDate || '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-challenge-card__actions">
                    <button
                      className="admin-btn admin-btn--small admin-btn--secondary"
                      onClick={() => handleEditChallenge(challenge)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="admin-btn admin-btn--small admin-btn--warning"
                      onClick={() => handleToggleStatus(challenge.id)}
                    >
                      {challenge.status === 'active' ? 'Архивировать' : 'Активировать'}
                    </button>
                    <button
                      className="admin-btn admin-btn--small admin-btn--danger"
                      onClick={() => handleDeleteChallenge(challenge.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="admin-pagination">
              <button
                className="admin-btn admin-btn--small"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Назад
              </button>
              <span>
                Страница {pagination.page} из {pagination.pages} (Всего: {pagination.total})
              </span>
              <button
                className="admin-btn admin-btn--small"
                disabled={page >= pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}

      {showAddModal && (
        <PlaceholderModal
          title="Создать челлендж"
          onClose={() => setShowAddModal(false)}
          featureName="Создание челленджей"
        />
      )}

      {editingChallenge && (
        <PlaceholderModal
          title="Редактировать челлендж"
          onClose={() => setEditingChallenge(null)}
          featureName="Редактирование челленджей"
        />
      )}

      {confirmDeleteId && (
        <Modal
          isOpen={!!confirmDeleteId}
          onClose={() => setConfirmDeleteId(null)}
          title="Удалить челлендж?"
        >
          <p>Вы уверены, что хотите удалить этот челлендж?</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
            <button
              className="admin-btn"
              onClick={() => setConfirmDeleteId(null)}
              disabled={saving}
            >
              Отмена
            </button>
            <button
              className="admin-btn admin-btn--danger"
              onClick={confirmDelete}
              disabled={saving}
            >
              {saving ? 'Удаление...' : 'Удалить'}
            </button>
          </div>
        </Modal>
      )}

      {infoModal.open && (
        <Modal
          isOpen={infoModal.open}
          onClose={() => setInfoModal({ open: false, message: '' })}
          title="Сообщение"
        >
          <p>{infoModal.message}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="admin-btn" onClick={() => setInfoModal({ open: false, message: '' })}>
              Ок
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ChallengeManagement
