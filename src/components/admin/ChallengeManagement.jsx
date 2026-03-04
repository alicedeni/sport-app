import React, { useState, useEffect } from 'react'
import { adminService } from '@shared/services/adminService'
import Modal from '@shared/ui/Modal'
import logger from '@shared/utils/logger'

const isChallengeExpired = (challenge) => {
  const endValue = challenge?.end_at || challenge?.endAt || challenge?.endDate
  if (!endValue) {
    return false
  }

  const endDate = new Date(endValue)
  if (Number.isNaN(endDate.getTime())) {
    return false
  }

  return endDate.getTime() < Date.now()
}

const METRIC_UNITS = {
  distance: 'км',
  calories: 'ккал',
  points: 'баллов',
  steps: 'шагов',
  duration: 'ч',
}

const formatMetricValue = (value, metricType = 'points') => {
  if (value == null || value === '') {
    return '-'
  }

  const cleanType = metricType || 'points'

  if (cleanType === 'duration') {
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) {
      return `${value}`
    }
    const totalMinutes = Math.round(numericValue * 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.abs(totalMinutes % 60)
    return `${hours}ч ${minutes.toString().padStart(2, '0')}м`
  }

  if (cleanType === 'distance') {
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) {
      return `${value}`
    }
    return numericValue.toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

  const numericValue = Number(value)
  if (Number.isNaN(numericValue)) {
    return `${value}`
  }

  return numericValue.toLocaleString('ru-RU')
}

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
  const [rewardingParticipantId, setRewardingParticipantId] = useState(null)
  const [participantsMetricType, setParticipantsMetricType] = useState('')
  const [isParticipantsTeamChallenge, setIsParticipantsTeamChallenge] = useState(false)
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
        ...(statusFilter && statusFilter !== 'expired' && { status: statusFilter }),
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

  const filteredChallenges = challenges
    .filter(
      (challenge) =>
        challenge.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.title?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((challenge) => {
      if (statusFilter === 'expired') {
        return isChallengeExpired(challenge)
      }
      if (statusFilter === 'active') {
        return !isChallengeExpired(challenge)
      }
      return true
    })

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
      const response = await adminService.updateChallenge(challengeId, { status: newStatus })
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
    const trimmedName = form.name?.trim()
    if (!trimmedName) {
      errors.name = 'Введите название'
    } else if (trimmedName.length > 255) {
      errors.name = 'Название до 255 символов'
    }

    if (!form.description?.trim()) errors.description = 'Введите описание'
    if (!['individual', 'team'].includes(form.type)) errors.type = 'Тип: individual/team'
    if (!['', 'bronze', 'silver', 'gold'].includes(form.league))
      errors.league = 'Лига: bronze/silver/gold'
    if (!['distance', 'calories', 'points', 'steps', 'duration'].includes(form.metric_type))
      errors.metric_type = 'Метрика: distance/calories/points/steps/duration'

    if (form.target_value === '' || form.target_value == null) {
      errors.target_value = 'Укажите цель'
    } else {
      const target = Number(form.target_value)
      if (!(target > 0)) errors.target_value = 'Число > 0'
    }

    if (!form.start_at) {
      errors.start_at = 'Укажите дату начала'
    } else if (Number.isNaN(Date.parse(form.start_at))) {
      errors.start_at = 'Некорректная дата'
    }

    if (!form.end_at) {
      errors.end_at = 'Укажите дату окончания'
    } else if (Number.isNaN(Date.parse(form.end_at))) {
      errors.end_at = 'Некорректная дата'
    }

    if (!errors.start_at && !errors.end_at) {
      const startTime = Date.parse(form.start_at)
      const endTime = Date.parse(form.end_at)
      if (startTime > endTime) {
        errors.end_at = 'Окончание должно быть позже начала'
      }
    }

    if (form.reward_points !== '' && form.reward_points != null) {
      const reward = Number(form.reward_points)
      if (Number.isNaN(reward) || reward < 0) errors.reward_points = 'Число ≥ 0'
    }

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
      const trimmedName = form.name.trim()
      const trimmedDescription = form.description?.trim()
      const activityTypes = form.activity_types
        ? form.activity_types
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []

      const payload = {
        name: trimmedName,
        challenge_type: form.type,
        metric_type: form.metric_type,
        target_value: Number(form.target_value),
        start_at: form.start_at,
        end_at: form.end_at,
      }

      if (form.verification_mode) {
        payload.verification_mode = form.verification_mode
      }

      if (trimmedDescription) {
        payload.description = trimmedDescription
      }

      if (form.league) {
        payload.league = form.league
      }

      if (activityTypes.length) {
        payload.activity_types = activityTypes
      }

      if (form.reward_points !== '' && form.reward_points != null) {
        const rewardValue = Number(form.reward_points)
        if (!Number.isNaN(rewardValue)) {
          payload.reward_points = rewardValue
        }
      }

      const trimmedBadge = form.reward_badge?.trim()
      if (trimmedBadge) {
        payload.reward_badge = trimmedBadge
      }

      if (editingChallenge?.id && form.status) {
        payload.status = form.status
      }

      const trimmedCover = form.cover_image?.trim()
      if (trimmedCover) {
        payload.cover_image = trimmedCover
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
    const challenge = challenges.find((c) => c.id === challengeId)
    setParticipantsMetricType(challenge?.metric_type || challenge?.metricType || '')
    setIsParticipantsTeamChallenge(challenge?.type === 'team' || challenge?.challenge_type === 'team')
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
        if (payload?.pagination?.page) {
          setParticipantsPage(payload.pagination.page)
        }
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

  const formatDateTime = (value) => {
    if (!value) {
      return ''
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleRewardParticipant = async (participant) => {
    if (!participantsForId) {
      return
    }

    const participantId = participant?.participant_id || participant?.id || participant?.user_id

    if (!participantId) {
      setInfoModal({
        open: true,
        message: 'Не удалось определить участника для начисления баллов',
      })
      return
    }

    if (rewardingParticipantId) {
      return
    }

    setRewardingParticipantId(participantId)
    try {
      const response = await adminService.rewardChallengeParticipant(
        participantsForId,
        participantId,
      )
      if (response.data.status === 200) {
        const payload = response.data?.data || response.data
        let message = 'Баллы начислены участнику'

        if (payload?.distribution?.length) {
          const distributionSummary = payload.distribution
            .map((item) => {
              const label =
                item.username ||
                item.name ||
                item.team_name ||
                item.teamName ||
                `${item.firstName || ''} ${item.lastName || ''}`.trim() ||
                item.user_id ||
                item.id ||
                'участник'
              const points =
                item.awarded_points ??
                item.points ??
                item.reward_points ??
                item.reward ??
                item.value
              if (points == null) return label
              return `${label}: ${points}`
            })
            .join('; ')

          if (distributionSummary) {
            message = `${message}. Распределение: ${distributionSummary}`
          }
        }

        setInfoModal({
          open: true,
          message,
        })
        await loadParticipants(participantsForId, participantsPage)
      } else {
        setInfoModal({
          open: true,
          message: response.data.error || response.data.message || 'Ошибка при начислении баллов',
        })
      }
    } catch (err) {
      logger.error('Ошибка начисления баллов участнику челленджа:', err)
      setInfoModal({
        open: true,
        message: err.response?.data?.error || err.message || 'Ошибка при начислении баллов',
      })
    } finally {
      setRewardingParticipantId(null)
    }
  }

  const filteredParticipantsList = isParticipantsTeamChallenge
    ? participants.filter((p) => {
        const participantType = (p?.type || '').toLowerCase()
        if (participantType === 'team') {
          return true
        }
        if (!p?.user_id && (p?.team_id || p?.teamId)) {
          return true
        }
        return false
      })
    : participants

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
            <option value="expired">Срок истек</option>
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
                <label className="admin-setting__label">
                  Название <span className="admin-required">*</span>
                </label>
                <input
                  className="admin-input"
                  value={form.name}
                  maxLength={255}
                  required
                  onChange={(e) => onChangeField('name', e.target.value)}
                />
                {formErrors.name && <div className="admin-field-error">{formErrors.name}</div>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-setting__label">
                  Описание <span className="admin-required">*</span>
                </label>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={form.description}
                  required
                  onChange={(e) => onChangeField('description', e.target.value)}
                />
                {formErrors.description && (
                  <div className="admin-field-error">{formErrors.description}</div>
                )}
              </div>
              <div>
                <label className="admin-setting__label">
                  Тип челленджа <span className="admin-required">*</span>
                </label>
                <select
                  className="admin-select"
                  value={form.type}
                  required
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
                <label className="admin-setting__label">
                  Метрика <span className="admin-required">*</span>
                </label>
                <select
                  className="admin-select"
                  value={form.metric_type}
                  required
                  onChange={(e) => onChangeField('metric_type', e.target.value)}
                >
                  <option value="distance">Дистанция (км)</option>
                  <option value="calories">Калории</option>
                  <option value="points">Баллы</option>
                  <option value="steps">Шаги</option>
                  <option value="duration">Время (ч)</option>
                </select>
                {formErrors.metric_type && (
                  <div className="admin-field-error">{formErrors.metric_type}</div>
                )}
              </div>
              <div>
                <label className="admin-setting__label">
                  Цель (значение) <span className="admin-required">*</span>
                </label>
                <input
                  className="admin-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.target_value}
                  required
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
                <label className="admin-setting__label">Баллы</label>
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
                <label className="admin-setting__label">
                  Начало <span className="admin-required">*</span>
                </label>
                <input
                  className="admin-input"
                  type="datetime-local"
                  value={form.start_at}
                  required
                  onChange={(e) => onChangeField('start_at', e.target.value)}
                />
                {formErrors.start_at && (
                  <div className="admin-field-error">{formErrors.start_at}</div>
                )}
              </div>
              <div>
                <label className="admin-setting__label">
                  Окончание <span className="admin-required">*</span>
                </label>
                <input
                  className="admin-input"
                  type="datetime-local"
                  value={form.end_at}
                  required
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
                  <option value="archived">Архивирован</option>
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
              filteredChallenges.map((challenge) => {
                const expired = isChallengeExpired(challenge)
                return (
                  <div key={challenge.id} className="admin-challenge-card">
                    <div className="admin-challenge-card__header">
                      <div className="admin-challenge-card__title">
                        {challenge.name || challenge.title}
                      </div>
                      {expired ? (
                        <span className="admin-challenge-status admin-challenge-status--expired">
                          Срок истек
                        </span>
                      ) : (
                        getStatusBadge(challenge.status)
                      )}
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
                )
              })
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
            setRewardingParticipantId(null)
            setParticipantsMetricType('')
            setIsParticipantsTeamChallenge(false)
          }}
          title="Участники челленджа"
          size="large"
        >
          {participantsLoading ? (
            <div style={{ textAlign: 'center', padding: 16 }}>Загрузка...</div>
          ) : filteredParticipantsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 16 }}>Участники не найдены</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {filteredParticipantsList.map((p, idx) => {
                const rewardGranted = p.reward_granted === true || p.rewardGranted === true
                const rewardPoints =
                  p.reward_points_awarded ?? p.rewardPointsAwarded ?? p.reward_points ?? null
                const rewardedAt = p.reward_granted_at || p.rewardGrantedAt || null
                const participantId = p?.participant_id || p?.id || p?.user_id
                const participantType = (p?.type || '').toLowerCase()
                const teamName = p?.team_name || p?.teamName
                const rewardDate = formatDateTime(rewardedAt)
                const lastActivity = formatDateTime(p.last_activity || p.lastActivity)
                const metricType = p.metric_type || participantsMetricType || 'points'
                const targetRaw = p.target_value ?? p.targetValue ?? null
                const currentRaw = p.current_value ?? p.progress ?? null
                const formattedCurrent = formatMetricValue(currentRaw, metricType)
                const formattedTarget = formatMetricValue(targetRaw, metricType)

                const displayName =
                  participantType === 'team'
                    ? teamName || `Команда #${p.team_id || p.teamId || participantId}`
                    : p.username ||
                      `${p.firstName || ''} ${p.lastName || ''}`.trim() ||
                      p.email ||
                      `ID ${p.user_id || p.id}`

                const membersLabel =
                  participantType === 'team' && (p.members_count != null || p.membersCount != null)
                    ? `Участников: ${p.members_count ?? p.membersCount}`
                    : ''

                const completed =
                  p.completed === true ||
                  p.is_completed === true ||
                  p.status === 'completed' ||
                  p.progress_status === 'completed' ||
                  (typeof currentRaw === 'number' && typeof targetRaw === 'number' && currentRaw >= targetRaw) ||
                  (typeof p.percentage === 'number' && p.percentage >= 100) ||
                  (typeof p.progress_percent === 'number' && p.progress_percent >= 100)
                const canReward = completed && !rewardGranted

                return (
                  <div
                    key={participantId || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'stretch',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: 12,
                      border: '1px solid #eee',
                      borderRadius: 8,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        flex: '1 1 60%',
                        minWidth: 0,
                      }}
                    >
                      <div style={{ fontWeight: 600, minWidth: 32 }}>#{p.rank || p.position || idx + 1}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <div style={{ fontWeight: 600 }}>{displayName}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                          Прогресс: {formattedCurrent}
                          {formattedTarget !== '-' ? ` / ${formattedTarget}` : ''}
                          {metricType !== 'duration' && METRIC_UNITS[metricType]
                            ? ` ${METRIC_UNITS[metricType]}`
                            : ''}
                        </div>
                        {membersLabel && (
                          <div style={{ fontSize: 11, color: '#999' }}>{membersLabel}</div>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 6,
                        flex: '0 0 auto',
                      }}
                    >
                      <div style={{ fontSize: 12, color: '#666' }}>{lastActivity}</div>
                      {rewardGranted ? (
                        <div
                          style={{
                            background: '#e0f7e9',
                            color: '#0a6b3e',
                            borderRadius: 6,
                            padding: '4px 10px',
                            fontSize: 12,
                            fontWeight: 600,
                            textAlign: 'right',
                          }}
                        >
                          Баллы выданы
                          {rewardPoints ? `: ${rewardPoints} баллов` : ''}
                          {rewardDate && (
                            <div style={{ fontSize: 11, fontWeight: 400, color: '#2f7d54' }}>{rewardDate}</div>
                          )}
                        </div>
                      ) : canReward ? (
                        <button
                          className="admin-btn admin-btn--small"
                          onClick={() => handleRewardParticipant(p)}
                          disabled={rewardingParticipantId === participantId || participantsLoading}
                        >
                          {rewardingParticipantId === participantId ? 'Начисление...' : 'Начислить баллы'}
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: 12,
                            color: '#999',
                            fontStyle: 'italic',
                          }}
                        >
                          В процессе
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
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
