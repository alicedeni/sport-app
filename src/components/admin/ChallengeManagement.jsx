import React, { useState, useEffect } from 'react'
import { adminService } from '@shared/services/adminService'
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
  const [participantsForId, setParticipantsForId] = useState(null)
  const [participants, setParticipants] = useState([])
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [participantsPage, setParticipantsPage] = useState(1)
  const [participantsPagination, setParticipantsPagination] = useState(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'individual',
    league: '',
    metric_type: 'distance',
    target_value: '',
    verification_mode: 'auto',
    activity_types: '',
    reward_points: '',
    reward_badge: '',
    start_at: '',
    end_at: '',
    status: 'draft',
    cover_image: '',
  })
  const [formErrors, setFormErrors] = useState({})

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
        const payload = response.data?.data || response.data
        const list = payload?.challenges || []
        const pg = payload?.pagination || null
        setChallenges(Array.isArray(list) ? list : [])
        setPagination(pg)
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
    setForm({
      name: challenge.name || challenge.title || '',
      description: challenge.description || '',
      type: challenge.type || 'individual',
      league: challenge.league || '',
      metric_type: challenge.metric_type || 'distance',
      target_value: challenge.target_value ?? '',
      verification_mode: challenge.verification_mode || 'auto',
      activity_types: Array.isArray(challenge.activity_types)
        ? challenge.activity_types.join(',')
        : challenge.activity_types || '',
      reward_points: challenge.reward_points ?? '',
      reward_badge: challenge.reward_badge || '',
      start_at: challenge.start_at || challenge.startAt || '',
      end_at: challenge.end_at || challenge.endAt || '',
      status: challenge.status || 'draft',
      cover_image: challenge.cover_image || '',
    })
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
        setInfoModal({
          open: true,
          message: response.data.error || response.data.message || 'Ошибка удаления челленджа',
        })
      }
    } catch (err) {
      setInfoModal({
        open: true,
        message: err.response?.data?.error || err.message || 'Ошибка при удалении челленджа',
      })
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
        setInfoModal({
          open: true,
          message: response.data.error || response.data.message || 'Ошибка изменения статуса',
        })
      }
    } catch (err) {
      setInfoModal({
        open: true,
        message: err.response?.data?.error || err.message || 'Ошибка при изменении статуса',
      })
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
        setInfoModal({
          open: true,
          message: response.data.error || response.data.message || 'Ошибка сохранения челленджа',
        })
      }
    } catch (err) {
      setInfoModal({
        open: true,
        message: err.response?.data?.error || err.message || 'Ошибка при сохранении челленджа',
      })
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!form.name?.trim()) errors.name = 'Введите название'
    if (!form.description?.trim()) errors.description = 'Введите описание'
    if (!['individual', 'team'].includes(form.type)) errors.type = 'Тип: individual/team'
    if (!['', 'bronze', 'silver', 'gold'].includes(form.league))
      errors.league = 'Лига: bronze/silver/gold'
    if (!['distance', 'calories', 'points'].includes(form.metric_type))
      errors.metric_type = 'Метрика: distance/calories/points'
    const target = Number(form.target_value)
    if (!(target >= 0)) errors.target_value = 'Число ≥ 0'
    const reward = Number(form.reward_points)
    if (!(reward >= 0)) errors.reward_points = 'Число ≥ 0'
    if (form.start_at && isNaN(Date.parse(form.start_at))) errors.start_at = 'Некорректная дата'
    if (form.end_at && isNaN(Date.parse(form.end_at))) errors.end_at = 'Некорректная дата'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onOpenCreate = () => {
    setForm({
      name: '',
      description: '',
      type: 'individual',
      league: '',
      metric_type: 'distance',
      target_value: '',
      verification_mode: 'auto',
      activity_types: '',
      reward_points: '',
      reward_badge: '',
      start_at: '',
      end_at: '',
      status: 'draft',
      cover_image: '',
    })
    setFormErrors({})
    setShowAddModal(true)
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        challenge_type: form.type,
        league: form.league || null,
        metric_type: form.metric_type,
        target_value: Number(form.target_value),
        verification_mode: form.verification_mode,
        activity_types: form.activity_types
          ? form.activity_types
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        reward_points: Number(form.reward_points || 0),
        reward_badge: form.reward_badge || null,
        start_at: form.start_at || null,
        end_at: form.end_at || null,
        status: form.status,
        cover_image: form.cover_image || null,
      }
      await handleSaveChallenge(payload)
      setShowAddModal(false)
      setEditingChallenge(null)
      setFormErrors({})
    } finally {
      setSaving(false)
    }
  }

  const onChangeField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (formErrors[key]) setFormErrors((e) => ({ ...e, [key]: '' }))
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

  const openParticipants = async (challengeId) => {
    setParticipantsForId(challengeId)
    setParticipantsPage(1)
    await loadParticipants(challengeId, 1)
  }

  const loadParticipants = async (challengeId, pageNum) => {
    setParticipantsLoading(true)
    try {
      const res = await adminService.getChallengeParticipants(challengeId, {
        page: pageNum,
        limit: 50,
      })
      if (res.data.status === 200) {
        const payload = res.data?.data || res.data
        setParticipants(payload.participants || payload.items || [])
        setParticipantsPagination(payload.pagination || null)
      } else {
        setParticipants([])
        setParticipantsPagination(null)
      }
    } catch (e) {
      setParticipants([])
      setParticipantsPagination(null)
    } finally {
      setParticipantsLoading(false)
    }
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
          <button className="admin-btn admin-btn--primary" onClick={onOpenCreate}>
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

      {!loading && (showAddModal || editingChallenge) && (
        <div className="admin-challenge-form-wrapper">
          <form onSubmit={onSubmitForm}>
            <div className="admin-form-grid">
              <div>
                <label className="admin-setting__label">Название</label>
                <input
                  className="admin-input"
                  value={form.name}
                  onChange={(e) => onChangeField('name', e.target.value)}
                />
                {formErrors.name && <div className="admin-field-error">{formErrors.name}</div>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-setting__label">Описание</label>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={form.description}
                  onChange={(e) => onChangeField('description', e.target.value)}
                />
                {formErrors.description && (
                  <div className="admin-field-error">{formErrors.description}</div>
                )}
              </div>
              <div>
                <label className="admin-setting__label">Тип</label>
                <select
                  className="admin-select"
                  value={form.type}
                  onChange={(e) => onChangeField('type', e.target.value)}
                >
                  <option value="individual">Индивидуальный</option>
                  <option value="team">Командный</option>
                </select>
                {formErrors.type && <div className="admin-field-error">{formErrors.type}</div>}
              </div>
              <div>
                <label className="admin-setting__label">Лига</label>
                <select
                  className="admin-select"
                  value={form.league}
                  onChange={(e) => onChangeField('league', e.target.value)}
                >
                  <option value="">Все</option>
                  <option value="bronze">Бронзовая</option>
                  <option value="silver">Серебряная</option>
                  <option value="gold">Золотая</option>
                </select>
                {formErrors.league && <div className="admin-field-error">{formErrors.league}</div>}
              </div>
              <div>
                <label className="admin-setting__label">Метрика</label>
                <select
                  className="admin-select"
                  value={form.metric_type}
                  onChange={(e) => onChangeField('metric_type', e.target.value)}
                >
                  <option value="distance">Дистанция (км)</option>
                  <option value="calories">Калории</option>
                  <option value="points">Баллы</option>
                </select>
                {formErrors.metric_type && (
                  <div className="admin-field-error">{formErrors.metric_type}</div>
                )}
              </div>
              <div>
                <label className="admin-setting__label">Цель (значение)</label>
                <input
                  className="admin-input"
                  type="number"
                  step="0.01"
                  value={form.target_value}
                  onChange={(e) => onChangeField('target_value', e.target.value)}
                />
                {formErrors.target_value && (
                  <div className="admin-field-error">{formErrors.target_value}</div>
                )}
              </div>
              <div>
                <label className="admin-setting__label">Верификация</label>
                <select
                  className="admin-select"
                  value={form.verification_mode}
                  onChange={(e) => onChangeField('verification_mode', e.target.value)}
                >
                  <option value="auto">Авто</option>
                </select>
              </div>
              <div>
                <label className="admin-setting__label">Типы активностей (через запятую)</label>
                <input
                  className="admin-input"
                  placeholder="run, walk"
                  value={form.activity_types}
                  onChange={(e) => onChangeField('activity_types', e.target.value)}
                />
              </div>
              <div>
                <label className="admin-setting__label">Награда (баллы)</label>
                <input
                  className="admin-input"
                  type="number"
                  value={form.reward_points}
                  onChange={(e) => onChangeField('reward_points', e.target.value)}
                />
                {formErrors.reward_points && (
                  <div className="admin-field-error">{formErrors.reward_points}</div>
                )}
              </div>
              <div>
                <label className="admin-setting__label">Бейдж (код)</label>
                <input
                  className="admin-input"
                  value={form.reward_badge}
                  onChange={(e) => onChangeField('reward_badge', e.target.value)}
                />
              </div>
              <div>
                <label className="admin-setting__label">Начало</label>
                <input
                  className="admin-input"
                  type="datetime-local"
                  value={form.start_at}
                  onChange={(e) => onChangeField('start_at', e.target.value)}
                />
                {formErrors.start_at && (
                  <div className="admin-field-error">{formErrors.start_at}</div>
                )}
              </div>
              <div>
                <label className="admin-setting__label">Окончание</label>
                <input
                  className="admin-input"
                  type="datetime-local"
                  value={form.end_at}
                  onChange={(e) => onChangeField('end_at', e.target.value)}
                />
                {formErrors.end_at && <div className="admin-field-error">{formErrors.end_at}</div>}
              </div>
              <div>
                <label className="admin-setting__label">Статус</label>
                <select
                  className="admin-select"
                  value={form.status}
                  onChange={(e) => onChangeField('status', e.target.value)}
                >
                  <option value="draft">Черновик</option>
                  <option value="active">Активен</option>
                  <option value="archived">Архив</option>
                  <option value="completed">Завершен</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-setting__label">Изображение (URL)</label>
                <input
                  className="admin-input"
                  value={form.cover_image}
                  onChange={(e) => onChangeField('cover_image', e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
              <button
                type="button"
                className="admin-btn"
                onClick={() => {
                  setShowAddModal(false)
                  setEditingChallenge(null)
                }}
              >
                Отмена
              </button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!loading && !showAddModal && !editingChallenge && (
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
                      className="admin-btn admin-btn--small"
                      onClick={() => openParticipants(challenge.id)}
                    >
                      Участники
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

      {participantsForId && (
        <Modal
          isOpen={!!participantsForId}
          onClose={() => {
            setParticipantsForId(null)
            setParticipants([])
            setParticipantsPagination(null)
          }}
          title="Участники челленджа"
          size="large"
        >
          {participantsLoading ? (
            <div style={{ textAlign: 'center', padding: 16 }}>Загрузка...</div>
          ) : participants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 16 }}>Участники не найдены</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {participants.map((p, idx) => (
                <div
                  key={p.id || p.user_id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: 8,
                    border: '1px solid #eee',
                    borderRadius: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontWeight: 600 }}>#{p.rank || p.position || idx + 1}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontWeight: 600 }}>
                        {p.username ||
                          `${p.firstName || ''} ${p.lastName || ''}`.trim() ||
                          p.email ||
                          `ID ${p.user_id || p.id}`}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        Прогресс: {p.current_value ?? p.progress ?? 0} / {p.target_value ?? ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {p.last_activity || p.lastActivity || ''}
                  </div>
                </div>
              ))}
            </div>
          )}
          {participantsPagination && participantsPagination.pages > 1 && (
            <div className="admin-pagination" style={{ marginTop: 12 }}>
              <button
                className="admin-btn admin-btn--small"
                disabled={participantsPage === 1 || participantsLoading}
                onClick={async () => {
                  const next = participantsPage - 1
                  setParticipantsPage(next)
                  await loadParticipants(participantsForId, next)
                }}
              >
                Назад
              </button>
              <span>
                Страница {participantsPagination.page || participantsPage} из{' '}
                {participantsPagination.pages}
              </span>
              <button
                className="admin-btn admin-btn--small"
                disabled={participantsPage >= participantsPagination.pages || participantsLoading}
                onClick={async () => {
                  const next = participantsPage + 1
                  setParticipantsPage(next)
                  await loadParticipants(participantsForId, next)
                }}
              >
                Вперед
              </button>
            </div>
          )}
        </Modal>
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
            <button
              className="admin-btn"
              onClick={() => setInfoModal({ open: false, message: '' })}
            >
              Ок
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ChallengeManagement
