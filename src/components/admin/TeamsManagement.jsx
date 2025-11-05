import React, { useEffect, useState } from 'react'
import Modal from '@shared/ui/Modal'
import { adminService } from '@shared/services/adminService'

const TeamsManagement = () => {
  const [teams, setTeams] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [renamingTeam, setRenamingTeam] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [memberOps, setMemberOps] = useState({
    teamId: null,
    userId: '',
    userQuery: '',
    userName: '',
  })
  const [userOptions, setUserOptions] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [membersByTeam, setMembersByTeam] = useState({})

  const loadTeams = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit, ...(query && { query }) }
      const res = await adminService.getTeams(params)
      if (res.data.status === 200) {
        setTeams(res.data.data.teams || [])
        setPagination(res.data.data.pagination || null)
      } else {
        setError(res.data.error || res.data.message || 'Ошибка загрузки команд')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Ошибка при загрузке команд')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeams()
  }, [page])
  useEffect(() => {
    const t = setTimeout(() => {
      page === 1 ? loadTeams() : setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const fetchUsers = async () => {
      if (!memberOps.userQuery || !memberOps.teamId) {
        setUserOptions([])
        return
      }
      setUsersLoading(true)
      try {
        const res = await adminService.getUsers({ query: memberOps.userQuery, limit: 10, page: 1 })
        if (res.data.status === 200) {
          const list = (res.data.data.users || []).map((u) => ({
            id: u.id,
            name:
              `${u.firstName || u.name || ''} ${u.lastName || u.surname || ''}`.trim() || u.email,
            email: u.email,
            teamId: u.team_id ?? u.teamId ?? null,
            teamName: u.team?.name || u.teamName || null,
          }))
          setUserOptions(list)
        }
      } catch (e) {
        setUserOptions([])
      } finally {
        setUsersLoading(false)
      }
    }
    const t = setTimeout(fetchUsers, 300)
    return () => clearTimeout(t)
  }, [memberOps.userQuery, memberOps.teamId])

  const [infoModal, setInfoModal] = useState({ open: false, message: '' })
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [membersModalTeamId, setMembersModalTeamId] = useState(null)

  const onCreateTeam = async (e) => {
    e.preventDefault()
    if (!newTeamName.trim()) return
    try {
      const res = await adminService.createTeam({ name: newTeamName.trim() })
      if (res.data.status === 200) {
        setShowCreateModal(false)
        setNewTeamName('')
        await loadTeams()
      } else {
        setInfoModal({ open: true, message: res.data.error || res.data.message || 'Ошибка создания команды' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при создании команды (возможно дублирование имени)' })
    }
  }

  const onStartRename = (team) => {
    setRenamingTeam(team)
    setRenameValue(team.name || '')
  }

  const onApplyRename = async (e) => {
    e.preventDefault()
    if (!renamingTeam) return
    try {
      const res = await adminService.renameTeam(renamingTeam.id, renameValue.trim())
      if (res.data.status === 200) {
        setRenamingTeam(null)
        await loadTeams()
      } else {
        setInfoModal({ open: true, message: res.data.error || res.data.message || 'Ошибка переименования команды' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при переименовании (возможно дублирование)' })
    }
  }

  const onDeleteTeam = async (teamId) => {
    try {
      const res = await adminService.deleteTeam(teamId)
      if (res.data.status === 200) {
        await loadTeams()
      } else {
        setInfoModal({ open: true, message: res.data.error || res.data.message || 'Ошибка удаления команды' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при удалении команды' })
    }
  }

  const toggleMembers = async (teamId) => {
    const current = membersByTeam[teamId]
    const nextOpen = !(current && current.open)
    setMembersByTeam((prev) => ({
      ...prev,
      [teamId]: { ...(prev[teamId] || {}), open: nextOpen },
    }))
    if (nextOpen && (!current || (!current.users && !current.loading))) {
      setMembersByTeam((prev) => ({
        ...prev,
        [teamId]: { ...(prev[teamId] || {}), loading: true, error: null, open: true },
      }))
      try {
        const res = await adminService.getTeamUsers(teamId, { page: 1, limit: 100 })
        if (res.data.status === 200) {
          const users = res.data.data.users || []
          setMembersByTeam((prev) => ({
            ...prev,
            [teamId]: { ...(prev[teamId] || {}), users, loading: false, error: null, open: true },
          }))
        } else {
          setMembersByTeam((prev) => ({
            ...prev,
            [teamId]: {
              ...(prev[teamId] || {}),
              loading: false,
              error: res.data.error || 'Ошибка загрузки участников',
              open: true,
            },
          }))
        }
      } catch (e) {
        setMembersByTeam((prev) => ({
          ...prev,
          [teamId]: {
            ...(prev[teamId] || {}),
            loading: false,
            error: e.response?.data?.error || e.message || 'Ошибка загрузки участников',
            open: true,
          },
        }))
      }
    }
  }

  const onAddUser = async (teamId) => {
    const uid = Number(memberOps.userId)
    if (!uid) return
    if (memberOps.userTeamId && Number(memberOps.userTeamId) !== Number(teamId)) {
      setInfoModal({ open: true, message: 'Пользователь уже состоит в другой команде. Сначала удалите из текущей команды.' })
      return
    }
    if (memberOps.userTeamId && Number(memberOps.userTeamId) === Number(teamId)) {
      setInfoModal({ open: true, message: 'Пользователь уже состоит в этой команде.' })
      return
    }
    try {
      const res = await adminService.addUserToTeam(teamId, uid)
      if (res.data.status === 200) {
        setMemberOps({ teamId: null, userId: '', userQuery: '', userName: '', userTeamId: null })
        setUserOptions([])
        await loadTeams()
      } else {
        setInfoModal({ open: true, message: res.data.error || res.data.message || 'Ошибка добавления пользователя' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при добавлении пользователя' })
    }
  }

  const onRemoveUser = async (teamId) => {
    const uid = Number(memberOps.userId)
    if (!uid) return
    try {
      const res = await adminService.removeUserFromTeam(teamId, uid)
      if (res.data.status === 200) {
        setMemberOps({ teamId: null, userId: '', userQuery: '', userName: '', userTeamId: null })
        setUserOptions([])
        await loadTeams()
      } else {
        setInfoModal({ open: true, message: res.data.error || res.data.message || 'Ошибка удаления пользователя' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при удалении пользователя' })
    }
  }

  return (
    <div className="admin-teams">
      <div className="admin-user-management__header">
        <h1 className="admin-user-management__title">Управление командами</h1>
        <div className="admin-user-management__actions">
          <div className="admin-search">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="admin-search__input"
            />
          </div>
          <button className="admin-btn admin-btn--primary" onClick={() => setShowCreateModal(true)}>
            + Создать команду
          </button>
        </div>
      </div>

      {error && <div className="admin-error-message">{error}</div>}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>
      ) : (
        <>
          <div className="admin-user-table">
            <div className="admin-user-table__header">
              <div className="admin-user-table__cell">Команда</div>
              <div className="admin-user-table__cell">Участников</div>
              <div className="admin-user-table__cell">Баллы</div>
              <div className="admin-user-table__cell">Действия</div>
            </div>
            {teams.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Команды не найдены</div>
            ) : (
              teams.map((team) => (
                <div key={team.id} className="admin-user-table__row">
                  <div className="admin-user-table__cell">
                    <div className="admin-user-info">
                      <div className="admin-user-info__name">{team.name}</div>
                    </div>
                  </div>
                  <div className="admin-user-table__cell">{team.members || 0}</div>
                  <div className="admin-user-table__cell">
                    <span className="admin-user-points">{team.totalPoints || 0}</span>
                  </div>
                  <div className="admin-user-table__cell">
                    <div className="admin-user-actions">
                      <button
                        className="admin-btn admin-btn--small admin-btn--secondary"
                        onClick={() => onStartRename(team)}
                      >
                        Переименовать
                      </button>
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center',
                        }}
                      >
                        <input
                          className="admin-input"
                          type="text"
                          placeholder="Найти пользователя..."
                          value={
                            memberOps.teamId === team.id
                              ? memberOps.userName || memberOps.userQuery
                              : ''
                          }
                          onFocus={() => setMemberOps({ ...memberOps, teamId: team.id })}
                          onChange={(e) =>
                            setMemberOps({
                              teamId: team.id,
                              userId: '',
                              userName: '',
                              userQuery: e.target.value,
                            })
                          }
                          style={{ width: 240 }}
                        />
                        {memberOps.teamId === team.id && (memberOps.userQuery || usersLoading) && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '40px',
                              left: 0,
                              width: 320,
                              maxHeight: 220,
                              overflowY: 'auto',
                              background: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: 8,
                              zIndex: 10,
                            }}
                          >
                            {usersLoading ? (
                              <div style={{ padding: 10, color: '#666' }}>Поиск...</div>
                            ) : userOptions.length === 0 ? (
                              <div style={{ padding: 10, color: '#666' }}>Не найдено</div>
                            ) : (
                              userOptions.map((u) => (
                                <button
                                  key={u.id}
                                  type="button"
                                  className="admin-btn"
                                  onClick={() =>
                                    setMemberOps({
                                      teamId: team.id,
                                      userId: String(u.id),
                                      userName: `${u.name}`,
                                      userQuery: '',
                                      userTeamId: u.teamId || null,
                                    })
                                  }
                                  style={{
                                    width: '100%',
                                    justifyContent: 'flex-start',
                                    background: 'white',
                                    border: 'none',
                                    borderBottom: '1px solid #f0f0f0',
                                    borderRadius: 0,
                                  }}
                                >
                                  {u.name}{' '}
                                  <span style={{ color: '#9ca3af', marginLeft: 8 }}>{u.email}</span>
                                  {u.teamName && (
                                    <span style={{ color: '#ef4444', marginLeft: 8 }}>
                                      (в команде: {u.teamName})
                                    </span>
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        )}
                        <button
                          className="admin-btn admin-btn--small"
                          onClick={() => onAddUser(team.id)}
                          disabled={!memberOps.userId}
                        >
                          Добавить
                        </button>
                        <button
                          className="admin-btn admin-btn--small admin-btn--warning"
                          onClick={() => onRemoveUser(team.id)}
                          disabled={!memberOps.userId}
                        >
                          Удалить
                        </button>
                      </div>
                      <button
                        className="admin-btn admin-btn--small"
                        onClick={async () => {
                          await toggleMembers(team.id)
                          setMembersModalTeamId(team.id)
                        }}
                      >
                        Показать участников
                      </button>
                      <button
                        className="admin-btn admin-btn--small admin-btn--danger"
                        onClick={() => setConfirmDeleteId(team.id)}
                      >
                        Удалить команду
                      </button>
                    </div>
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

          {membersModalTeamId && (
            <Modal
              isOpen={!!membersModalTeamId}
              onClose={() => setMembersModalTeamId(null)}
              title="Участники команды"
              size="large"
            >
              <div className="admin-team-members-modal">
                {membersByTeam[membersModalTeamId]?.loading ? (
                  <div className="admin-team-members-modal__loading">Загрузка...</div>
                ) : membersByTeam[membersModalTeamId]?.error ? (
                  <div className="admin-error-message">{membersByTeam[membersModalTeamId].error}</div>
                ) : !membersByTeam[membersModalTeamId]?.users || membersByTeam[membersModalTeamId]?.users.length === 0 ? (
                  <div className="admin-team-members-modal__empty">Пока нет участников</div>
                ) : (
                  <div className="admin-team-members-modal__grid">
                    {membersByTeam[membersModalTeamId].users.map((u) => (
                      <div key={u.id} className="admin-team-members-modal__card">
                        <div className="admin-team-members-modal__name">
                          {`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email}
                        </div>
                        <div className="admin-team-members-modal__email">{u.email}</div>
                        {u.league && (
                          <div className="admin-team-members-modal__meta">Лига: {u.league}</div>
                        )}
                        {u.points != null && (
                          <div className="admin-team-members-modal__meta">Баллы: {u.points}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Modal>
          )}
        </>
      )}

      {showCreateModal && (
        <div className="admin-modal">
          <div className="admin-modal__content">
            <div className="admin-modal__header">
              <h3>Создать команду</h3>
              <button className="admin-modal__close" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <div className="admin-modal__body">
              <form onSubmit={onCreateTeam}>
                <label className="admin-setting__label">
                  Название команды
                  <input
                    className="admin-input"
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    required
                  />
                </label>
                <div
                  style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}
                >
                  <button
                    type="button"
                    className="admin-btn"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Отмена
                  </button>
                  <button type="submit" className="admin-btn admin-btn--primary">
                    Создать
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {renamingTeam && (
        <div className="admin-modal">
          <div className="admin-modal__content">
            <div className="admin-modal__header">
              <h3>Переименовать команду</h3>
              <button className="admin-modal__close" onClick={() => setRenamingTeam(null)}>
                ×
              </button>
            </div>
            <div className="admin-modal__body">
              <form onSubmit={onApplyRename}>
                <label className="admin-setting__label">
                  Новое название
                  <input
                    className="admin-input"
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    required
                  />
                </label>
                <div
                  style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}
                >
                  <button type="button" className="admin-btn" onClick={() => setRenamingTeam(null)}>
                    Отмена
                  </button>
                  <button type="submit" className="admin-btn admin-btn--primary">
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Удалить команду?"
        size="small"
      >
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="admin-btn" onClick={() => setConfirmDeleteId(null)}>Отмена</button>
          <button
            className="admin-btn admin-btn--danger"
            onClick={async () => {
              const id = confirmDeleteId
              setConfirmDeleteId(null)
              await onDeleteTeam(id)
            }}
          >
            Удалить
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={infoModal.open}
        onClose={() => setInfoModal({ open: false, message: '' })}
        title="Сообщение"
        size="small"
      >
        <div style={{ marginBottom: 12 }}>{infoModal.message}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="admin-btn" onClick={() => setInfoModal({ open: false, message: '' })}>Ок</button>
        </div>
      </Modal>
    </div>
  )
}

export default TeamsManagement

const TeamMembersBlock = ({ team, state, onRefresh }) => {
  useEffect(() => {
    if (!state.users && !state.loading) {
      onRefresh()
    }
  }, [])

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: 8,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Участники команды «{team.name}»</div>
      {state.loading ? (
        <div style={{ padding: 10, color: '#666' }}>Загрузка...</div>
      ) : state.error ? (
        <div className="admin-error-message">{state.error}</div>
      ) : !state.users || state.users.length === 0 ? (
        <div style={{ padding: 10, color: '#666' }}>Пока нет участников</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 8,
          }}
        >
          {state.users.map((u) => (
            <div key={u.id} style={{ background: '#f3f4f6', borderRadius: 8, padding: 8 }}>
              <div style={{ fontWeight: 600 }}>
                {`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email}
              </div>
              <div style={{ color: '#6b7280', fontSize: 12 }}>{u.email}</div>
              <div style={{ color: '#6b7280', fontSize: 12 }}>
                {u.league ? `Лига: ${u.league}` : ''}
              </div>
              <div style={{ color: '#6b7280', fontSize: 12 }}>
                {u.points != null ? `Баллы: ${u.points}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
