import React, { useState, useEffect } from 'react'
import Modal from '@shared/ui/Modal'
import { adminService } from '@shared/services/adminService'
import PlaceholderModal from '@components/admin/PlaceholderModal.jsx'
import logger from '@shared/utils/logger'

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const initialUserForm = {
    surname: '',
    name: '',
    email: '',
    password: '',
    role: 'user',
    is_active: true,
  }
  const [newUser, setNewUser] = useState(initialUserForm)
  const [editUserForm, setEditUserForm] = useState({ ...initialUserForm, password: undefined })

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        page,
        limit,
        ...(searchTerm && { query: searchTerm }),
        ...(roleFilter && { role: roleFilter }),
      }

      const response = await adminService.getUsers(params)
      if (response.data.status === 200) {
        setUsers(response.data.data.users || [])
        setPagination(response.data.data.pagination || null)
      } else {
        setError(response.data.error || response.data.message || 'Ошибка загрузки пользователей')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Ошибка при загрузке пользователей')
      logger.error('Ошибка загрузки пользователей:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [page, roleFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        loadUsers()
      } else {
        setPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleEditUser = (user) => {
    setEditingUser(user)
    setEditUserForm({
      surname: user.lastName || user.surname || '',
      name: user.firstName || user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      password: undefined,
    })
  }

  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [infoModal, setInfoModal] = useState({ open: false, message: '' })

  const handleDeleteUser = async (userId) => {
    try {
      const response = await adminService.deleteUser(userId)
      if (response.data.status === 200) {
        await loadUsers()
      } else {
        setInfoModal({ open: true, message: response.data.error || response.data.message || 'Ошибка удаления пользователя' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при удалении пользователя' })
    }
  }

  const handleSaveUser = async (userData) => {
    try {
      let response
      if (editingUser?.id) {
        response = await adminService.updateUser(editingUser.id, userData)
      } else {
        response = await adminService.createUser(userData)
      }

      if (response.data.status === 200) {
        setEditingUser(null)
        setShowAddModal(false)
        await loadUsers()
      } else {
        setInfoModal({ open: true, message: response.data.error || response.data.message || 'Ошибка сохранения пользователя' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при сохранении пользователя' })
    }
  }

  const onCreateUser = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        surname: newUser.surname?.trim(),
        name: newUser.name?.trim(),
        email: newUser.email?.trim(),
        password: newUser.password,
        role: newUser.role,
        is_active: newUser.is_active,
      }
      const res = await adminService.createUser(payload)
      if (res.data.status === 200) {
        setShowAddModal(false)
        setNewUser(initialUserForm)
        await loadUsers()
      } else {
        setInfoModal({ open: true, message: res.data.error || res.data.message || 'Ошибка создания пользователя' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при создании пользователя' })
    } finally {
      setSaving(false)
    }
  }

  const onUpdateUser = async (e) => {
    e.preventDefault()
    if (!editingUser) return
    setSaving(true)
    try {
      const payload = {
        surname: editUserForm.surname?.trim(),
        name: editUserForm.name?.trim(),
        email: editUserForm.email?.trim(),
        role: editUserForm.role,
        is_active: editUserForm.is_active,
      }
      const res = await adminService.updateUser(editingUser.id, payload)
      if (res.data.status === 200) {
        setEditingUser(null)
        await loadUsers()
      } else {
        setInfoModal({ open: true, message: res.data.error || res.data.message || 'Ошибка сохранения пользователя' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при сохранении пользователя' })
    } finally {
      setSaving(false)
    }
  }

  const getLeagueName = (league) => {
    if (!league) return '-'
    const leagueMap = {
      bronze: 'Бронзовая',
      silver: 'Серебряная',
      gold: 'Золотая',
      platinum: 'Платиновая',
      diamond: 'Бриллиантовая',
    }
    return leagueMap[league.toLowerCase()] || league
  }

  return (
    <div className="admin-user-management">
      <div className="admin-user-management__header">
        <h1 className="admin-user-management__title">Управление пользователями</h1>
        <div className="admin-user-management__actions">
          <div className="admin-search">
            <input
              type="text"
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search__input"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">Все роли</option>
            <option value="user">Пользователь</option>
            <option value="moderator">Модератор</option>
            <option value="admin">Администратор</option>
          </select>
          <button className="admin-btn admin-btn--primary" onClick={() => setShowAddModal(true)}>
            + Добавить пользователя
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
          <div className="admin-user-table">
            <div className="admin-user-table__header">
              <div className="admin-user-table__cell">Пользователь</div>
              <div className="admin-user-table__cell">Роль</div>
              <div className="admin-user-table__cell">Лига</div>
              <div className="admin-user-table__cell">Баллы</div>
              <div className="admin-user-table__cell">Действия</div>
            </div>

            {users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Пользователи не найдены</div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="admin-user-table__row">
                  <div className="admin-user-table__cell">
                    <div className="admin-user-info">
                      <div className="admin-user-info__name">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="admin-user-info__email">{user.email}</div>
                    </div>
                  </div>
                  <div className="admin-user-table__cell">{user.role || 'user'}</div>
                  <div className="admin-user-table__cell">{getLeagueName(user.league)}</div>
                  <div className="admin-user-table__cell">
                    <span className="admin-user-points">{user.points || 0}</span>
                  </div>
                  <div className="admin-user-table__cell">
                    <div className="admin-user-actions">
                      <button
                        className="admin-btn admin-btn--small admin-btn--secondary"
                        onClick={() => handleEditUser(user)}
                      >
                        Редактировать
                      </button>
                      <button
                        className="admin-btn admin-btn--small admin-btn--danger"
                        onClick={() => setConfirmDeleteId(user.id)}
                      >
                        Удалить
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
        </>
      )}

      {showAddModal && (
        <div className="admin-modal">
          <div className="admin-modal__content">
            <div className="admin-modal__header">
              <h3>Добавить пользователя</h3>
              <button className="admin-modal__close" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="admin-modal__body">
              <form onSubmit={onCreateUser}>
                <div style={{ display: 'grid', gap: 12 }}>
                  <label className="admin-setting__label">
                    Фамилия
                    <input
                      className="admin-input"
                      type="text"
                      value={newUser.surname}
                      onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
                      required
                    />
                  </label>
                  <label className="admin-setting__label">
                    Имя
                    <input
                      className="admin-input"
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </label>
                  <label className="admin-setting__label">
                    Email
                    <input
                      className="admin-input"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                      autoComplete="email"
                    />
                  </label>
                  <label className="admin-setting__label">
                    Пароль
                    <input
                      className="admin-input"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      minLength={4}
                      required
                      autoComplete="new-password"
                    />
                  </label>
                  <label className="admin-setting__label">
                    Роль
                    <select
                      className="admin-select"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="user">Пользователь</option>
                      <option value="moderator">Модератор</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </label>
                </div>
                <div
                  style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}
                >
                  <button
                    type="button"
                    className="admin-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Отмена
                  </button>
                  <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="admin-modal">
          <div className="admin-modal__content">
            <div className="admin-modal__header">
              <h3>Редактировать пользователя</h3>
              <button className="admin-modal__close" onClick={() => setEditingUser(null)}>
                ×
              </button>
            </div>
            <div className="admin-modal__body">
              <form onSubmit={onUpdateUser}>
                <div style={{ display: 'grid', gap: 12 }}>
                  <label className="admin-setting__label">
                    Фамилия
                    <input
                      className="admin-input"
                      type="text"
                      value={editUserForm.surname}
                      onChange={(e) =>
                        setEditUserForm({ ...editUserForm, surname: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label className="admin-setting__label">
                    Имя
                    <input
                      className="admin-input"
                      type="text"
                      value={editUserForm.name}
                      onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                      required
                    />
                  </label>
                  <label className="admin-setting__label">
                    Email
                    <input
                      className="admin-input"
                      type="email"
                      value={editUserForm.email}
                      onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                      required
                    />
                  </label>
                  <label className="admin-setting__label">
                    Роль
                    <select
                      className="admin-select"
                      value={editUserForm.role}
                      onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                    >
                      <option value="user">Пользователь</option>
                      <option value="moderator">Модератор</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </label>
                </div>
                <div
                  style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}
                >
                  <button type="button" className="admin-btn" onClick={() => setEditingUser(null)}>
                    Отмена
                  </button>
                  <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                    {saving ? 'Сохранение...' : 'Сохранить'}
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
        title="Удалить пользователя?"
        size="small"
      >
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="admin-btn" onClick={() => setConfirmDeleteId(null)}>Отмена</button>
          <button
            className="admin-btn admin-btn--danger"
            onClick={async () => {
              const id = confirmDeleteId
              setConfirmDeleteId(null)
              await handleDeleteUser(id)
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

export default UserManagement
