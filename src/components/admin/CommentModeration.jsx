import React, { useState, useEffect, useRef } from 'react'
import Modal from '@shared/ui/Modal'
import { adminService } from '@shared/services/adminService'
import SafeText from '@shared/components/SafeText'
import logger from '@shared/utils/logger'

const CommentModeration = () => {
  const [comments, setComments] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    page: 1,
    limit: 20,
  })

  const abortRef = useRef(null)

  const loadComments = async () => {
    setLoading(true)
    setError(null)
    try {
      if (abortRef.current) {
        abortRef.current.abort()
      }
      abortRef.current = new AbortController()
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.from && { from: filters.from }),
        ...(filters.to && { to: filters.to }),
      }
      const response = await adminService.getComments({ ...params, signal: abortRef.current.signal })
      if (response.data.status === 200) {
        setComments(response.data.data.comments || [])
        setPagination(response.data.data.pagination || null)
      } else {
        setError(response.data.error || response.data.message || 'Ошибка загрузки комментариев')
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        setError(err.response?.data?.error || err.message || 'Ошибка при загрузке комментариев')
        logger.error('Ошибка загрузки комментариев:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [filters.page, filters.from, filters.to])

  const [infoModal, setInfoModal] = useState({ open: false, message: '' })
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const handleUpdateStatus = async (commentId, newStatus) => {
    try {
      const response = await adminService.updateCommentStatus(commentId, newStatus)
      if (response.data.status === 200) {
        await loadComments()
      } else {
        setInfoModal({ open: true, message: response.data.error || response.data.message || 'Ошибка обновления статуса' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при обновлении статуса' })
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await adminService.deleteComment(commentId)
      if (response.data.status === 200) {
        await loadComments()
      } else {
        setInfoModal({ open: true, message: response.data.error || response.data.message || 'Ошибка удаления комментария' })
      }
    } catch (err) {
      setInfoModal({ open: true, message: err.response?.data?.error || err.message || 'Ошибка при удалении комментария' })
    }
  }

  return (
    <div className="admin-comment-moderation">
      <div className="admin-comment-moderation__header">
        <h1 className="admin-comment-moderation__title">Модерация комментариев</h1>
        <div className="admin-comment-moderation__filters" style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="admin-setting__label" style={{ marginBottom: 4, fontSize: 12, color: '#6b7280' }}>Начало</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value, page: 1 })}
              className="admin-input"
            />
          </div>
          <span style={{ color: '#6b7280' }}>—</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="admin-setting__label" style={{ marginBottom: 4, fontSize: 12, color: '#6b7280' }}>Окончание</label>
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
          <div className="admin-comment-list">
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Комментарии не найдены</div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="admin-comment-item">
                  <div className="admin-comment-item__header">
                    <div className="admin-comment-item__author">
                      {comment.authorName} {comment.authorSurname}
                    </div>
                    <div className="admin-comment-item__date">
                      Дата комментария: {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                    <div className="admin-comment-item__post">Пост ID: {comment.postId}</div>
                  </div>
                  <div className="admin-comment-item__body">
                    <div className="admin-comment-item__text">
                      <SafeText text={comment.text} preserveLineBreaks={true} />
                    </div>
                    <div className="admin-comment-item__stats">
                      <span>Лайки: {comment.likeCount || 0}</span>
                    </div>
                  </div>
                  <div className="admin-comment-item__actions">
                    <button
                      className="admin-btn admin-btn--small admin-btn--danger"
                      onClick={() => setConfirmDeleteId(comment.id)}
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
                disabled={filters.page === 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              >
                Назад
              </button>
              <span>
                Страница {pagination.page} из {pagination.pages}
              </span>
              <button
                className="admin-btn admin-btn--small"
                disabled={filters.page >= pagination.pages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Удалить комментарий?"
        size="small"
      >
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="admin-btn" onClick={() => setConfirmDeleteId(null)}>Отмена</button>
          <button
            className="admin-btn admin-btn--danger"
            onClick={async () => {
              const id = confirmDeleteId
              setConfirmDeleteId(null)
              await handleDeleteComment(id)
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

export default CommentModeration

