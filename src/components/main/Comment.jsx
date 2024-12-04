import React, { useState } from 'react'
import { IconButton } from '@material-ui/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import HeartFilled from '../../assets/icons/heartFilled.svg'
import HeartDefault from '../../assets/icons/heartDefault.svg'
import DeleteDefault from '../../assets/icons/deleteDefault.svg'
import axios from 'axios'
import { link } from '../../consts.js'

const Comment = ({ comment, onDelete }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked)
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0)
  console.log(comment)
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
    <div className="post__comment">
      <div className="post__comment-start">
        <strong>{comment.is_current_user ? 'Вы' : `${comment.surname} ${comment.name}`}</strong>
        <div>{comment.text}</div>
        <div className="post__comment-timestamp">
          {format(new Date(comment.created_at), 'd MMMM, HH:mm', { locale: ru })}
        </div>
      </div>
      <div className="post__like-container-all">
        {comment.is_current_user && (
          <div className="post__like-container-comments">
            <IconButton onClick={() => onDelete(comment.comment_id)}>
              <img src={DeleteDefault} alt="" style={{ width: '24px' }} />
            </IconButton>
          </div>
        )}
        <div className="post__like-container-comments">
          <div className="post__like-count-comments">{likeCount}</div>
          <IconButton onClick={handleLikeClick}>
            {isLiked ? (
              <img src={HeartFilled} alt="Liked" style={{ width: '24px' }} />
            ) : (
              <img src={HeartDefault} alt="Not Liked" style={{ width: '24px' }} />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default Comment
