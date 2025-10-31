import React, { useState, useEffect, useMemo } from 'react'
import { adminService } from '@shared/services/adminService'

const PostModeration = () => {
  const [posts, setPosts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingPost, setEditingPost] = useState(null)
  const [editForm, setEditForm] = useState({
    points: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [filters, setFilters] = useState({
    authorId: '',
    activityId: '',
    from: '',
    to: '',
    page: 1,
    limit: 20,
  })

  const loadPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.authorId && { author_id: filters.authorId }),
        ...(filters.activityId && { activity_id: filters.activityId }),
        ...(filters.from && { from: filters.from }),
        ...(filters.to && { to: filters.to }),
        ...(searchTerm && { query: searchTerm }),
      }

      const response = await adminService.getPosts(params)
      if (response.data.status === 200) {
        setPosts(response.data.data.posts || [])
        setPagination(response.data.data.pagination || null)
      } else {
        setError(response.data.error || response.data.message || 'Ошибка загрузки постов')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Ошибка при загрузке постов')
      console.error('Ошибка загрузки постов:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [filters.page, filters.authorId, filters.activityId, filters.from, filters.to])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.page === 1) {
        loadPosts()
      } else {
        setFilters({ ...filters, page: 1 })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleUpdateStatus = async (postId, newStatus) => {
    try {
      const response = await adminService.updatePostStatus(postId, newStatus)
      if (response.data.status === 200) {
        await loadPosts()
      } else {
        alert(response.data.error || response.data.message || 'Ошибка обновления статуса')
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Ошибка при обновлении статуса')
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      return
    }

    try {
      const response = await adminService.deletePost(postId)
      if (response.data.status === 200) {
        await loadPosts()
      } else {
        alert(response.data.error || response.data.message || 'Ошибка удаления поста')
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Ошибка при удалении поста')
    }
  }

  const openEdit = (post) => {
    setEditingPost(post)
    setFormErrors({})
    setEditForm({
      points: post.points ?? '',
    })
  }

  const closeEdit = () => {
    setEditingPost(null)
    setFormErrors({})
    setEditForm({
      points: '',
    })
  }

  const onEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((s) => ({ ...s, [name]: value }))
  }

  const validateEdit = () => {
    const errs = {}
    const isNumIn = (v, min, max) =>
      v === '' || (Number.isFinite(Number(v)) && Number(v) >= min && Number(v) <= max)
    if (!isNumIn(editForm.points, 0, 100000)) errs.points = '0-100000'

    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingPost) return
    if (!validateEdit()) return
    setSaving(true)
    try {
      const dataToSend = { points: Number(editForm.points) }
      const res = await adminService.updatePost(editingPost.id, dataToSend)
      if (res.data.status === 200) {
        closeEdit()
        await loadPosts()
      } else {
        setFormErrors({ general: res.data.error || res.data.message || 'Ошибка сохранения' })
      }
    } catch (err) {
      setFormErrors({ general: err.response?.data?.error || err.message || 'Ошибка сохранения' })
    } finally {
      setSaving(false)
    }
  }

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts
    const needle = searchTerm.trim().toLowerCase()
    return posts.filter((post) => {
      const fullName = `${post.authorName || ''} ${post.authorSurname || ''}`.trim().toLowerCase()
      return fullName.includes(needle)
    })
  }, [posts, searchTerm])

  return (
    <div className="admin-post-moderation">
      <div className="admin-post-moderation__header">
        <h1 className="admin-post-moderation__title">Модерация постов</h1>
        <div
          className="admin-post-moderation__filters"
          style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}
        >
          <div className="admin-search">
            <input
              type="text"
              placeholder="Поиск по имени автора..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search__input"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              className="admin-setting__label"
              style={{ marginBottom: 4, fontSize: 12, color: '#6b7280' }}
            >
              Начало
            </label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value, page: 1 })}
              className="admin-input"
            />
          </div>
          <span style={{ color: '#6b7280' }}>—</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              className="admin-setting__label"
              style={{ marginBottom: 4, fontSize: 12, color: '#6b7280' }}
            >
              Окончание
            </label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value, page: 1 })}
              className="admin-input"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="admin-error-message" style={{ color: 'red', padding: '10px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>
      ) : (
        <>
          <div className="admin-post-list">
            {filteredPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Посты не найдены</div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="admin-post-item">
                  <div className="admin-post-item__header">
                    <div className="admin-post-item__author">
                      {post.authorName} {post.authorSurname}
                    </div>
                    <div className="admin-post-item__date">
                      Дата:{' '}
                      {new Date(post.timeOfPublication || post.activityDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="admin-post-item__body">
                    <div className="admin-post-item__activity">
                      {post.activityName} ({post.activityTag})
                    </div>
                    {post.description && (
                      <div className="admin-post-item__description">{post.description}</div>
                    )}
                    <div className="admin-post-item__stats">
                      <span>Дистанция: {post.distance || '-'}</span>
                      <span>Калории: {post.calories || '-'}</span>
                      <span>Баллы: {post.points || 0}</span>
                      <span>Лайки: {post.likeCount || 0}</span>
                      <span>Комментарии: {post.commentCount || 0}</span>
                    </div>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                      />
                    )}
                  </div>
                  <div className="admin-post-item__actions">
                    <button className="admin-btn admin-btn--small" onClick={() => openEdit(post)}>
                      Редактировать
                    </button>
                    <button
                      className="admin-btn admin-btn--small admin-btn--danger"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {pagination && (
            <div className="admin-pagination">
              <button
                className="admin-btn admin-btn--small"
                disabled={filters.page === 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              >
                Назад
              </button>
              <span>
                Страница {pagination.page || filters.page} из {pagination.pages || 1} (Всего:{' '}
                {pagination.total || filteredPosts.length})
              </span>
              <button
                className="admin-btn admin-btn--small"
                disabled={!pagination.pages || filters.page >= pagination.pages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}

      {editingPost && (
        <div className="admin-modal">
          <div className="admin-modal__content">
            <div className="admin-modal__header">
              <h3>Редактировать пост</h3>
              <button className="admin-modal__close" onClick={closeEdit}>
                ×
              </button>
            </div>
            <div className="admin-modal__body">
              {formErrors.general && (
                <div className="admin-error-message">{formErrors.general}</div>
              )}
              <form onSubmit={handleSaveEdit}>
                <div className="admin-form-grid">
                  <div>
                    <label className="admin-setting__label">Баллы</label>
                    <input
                      className="admin-input"
                      name="points"
                      type="number"
                      value={editForm.points}
                      onChange={onEditChange}
                      placeholder="0-100000"
                    />
                    {formErrors.points && (
                      <div className="admin-field-error">{formErrors.points}</div>
                    )}
                  </div>
                </div>
                <div
                  style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}
                >
                  <button type="button" className="admin-btn" onClick={closeEdit}>
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
    </div>
  )
}

export default PostModeration
