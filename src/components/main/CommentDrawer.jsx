import React, { useState, useRef } from 'react'
import Comment from './Comment'
import SendDefault from '../../assets/icons/sendDefault.svg'
import SendFilled from '../../assets/icons/sendFilled.svg'

const CommentDrawer = ({
  isOpen,
  onClose,
  comments,
  commentText,
  onCommentChange,
  onSubmit,
  onDelete,
  commentCount,
}) => {
  const [startY, setStartY] = useState(null)
  const drawerRef = useRef(null)

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e) => {
    if (startY === null) return

    const currentY = e.touches[0].clientY
    const deltaY = currentY - startY

    if (deltaY > 0) {
      drawerRef.current.style.transform = `translateY(${deltaY}px)`
    }
  }

  const handleTouchEnd = (e) => {
    if (startY === null) return

    const currentY = e.changedTouches[0].clientY
    const deltaY = currentY - startY

    if (deltaY > 50) {
      onClose()
    } else {
      drawerRef.current.style.transform = 'translateY(0)'
    }

    setStartY(null)
  }

  return (
    <div
      className={`comment-drawer ${isOpen ? 'open' : ''}`}
      ref={drawerRef}
      style={{
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: startY === null ? 'transform 0.3s ease-in-out' : 'none',
      }}
    >
      <div
        className="drag-handle"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="drag-handle__line" />
      </div>
      <div className="header-comment">
        <div className="header-comment__title">Комментарии</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="header-comment__comment-count">{commentCount} комментариев</div>
          <button className="header-comment__close-button" onClick={onClose}>
            ×
          </button>
        </div>
      </div>

      <div className="comment-list">
        {comments.length === 0 ? (
          <div className="comment-list__no-comments">Тут пока нет комментариев</div>
        ) : (
          comments.map((comment, index) => (
            <Comment key={index} comment={comment} onDelete={onDelete} />
          ))
        )}
      </div>
      <div className="input-container-mobile">
        <textarea
          className="input-container-mobile__textarea"
          placeholder="Написать комментарий..."
          value={commentText}
          onChange={onCommentChange}
          maxLength={250}
        />
        <button className="input-container-mobile__send-button" onClick={onSubmit}>
          <img src={commentText ? SendFilled : SendDefault} alt="Отправить" />
        </button>
      </div>
    </div>
  )
}

export default CommentDrawer
