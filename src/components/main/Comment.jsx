import React, { useState, useEffect } from 'react'
import { IconButton } from '@material-ui/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import HeartFilled from '../../assets/icons/heartFilled.svg'
import HeartDefault from '../../assets/icons/heartDefault.svg'
import DeleteDefault from '../../assets/icons/deleteDefault.svg'
import axios from 'axios'
import { link } from '../../consts.js'

const Comment = ({ comment, onDelete }) => {
  const [isLiked, setIsLiked] = useState(comment.is_liked)
  const [likeCount, setLikeCount] = useState(comment.likeCountComment || 0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setIsLiked(comment.is_liked)
    setLikeCount(comment.likeCountComment || 0)
  }, [comment])

  const handleLikeClick = async () => {
    const likeData = { comment_id: comment.comment_id }
    const token = localStorage.getItem('token')

    try {
      const response = await axios.post(
        `${link}/${isLiked ? `user/comment/${comment.comment_id}/unlike` : `user/comment/${comment.comment_id}/like`}`,
        likeData,
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.data.status === 200) {
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
      } else {
        console.error('Error liking comment:', response.data.message)
      }
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  return (
    <div
      className="post__comment"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="post__comment-start">
        <strong>{comment.is_current_user ? 'Вы' : `${comment.surname} ${comment.name}`}</strong>
        <div>{comment.text}</div>
        <div className="post__comment-timestamp">
          {format(new Date(comment.created_at), 'd MMMM, HH:mm', { locale: ru })}
        </div>
      </div>

      <div className="post__like-container-all">
        {comment.is_current_user && isHovered ? (
          <div className="post__like-container-comments">
            <IconButton
              style={{ padding: '2px 12px' }}
              onClick={() => onDelete(comment.comment_id)}
            >
              <img
                className="post__icon-action-com"
                src={DeleteDefault}
                alt=""
                style={{ width: '24px' }}
              />
            </IconButton>
          </div>
        ) : (
          <div style={{ height: '32px' }}></div>
        )}

        <div className="post__like-container-comments">
          {likeCount > 0 && <div className="post__like-count-comments">{likeCount}</div>}

          <IconButton style={{ padding: '2px 12px' }} onClick={handleLikeClick}>
            <img
              className="post__icon-action-com"
              src={isLiked ? HeartFilled : HeartDefault}
              alt={isLiked ? 'Liked' : 'Not Liked'}
              style={{ width: '24px' }}
            />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default Comment
