import React, { useState, useEffect } from 'react'
import { IconButton } from '@mui/material'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import HeartFilled from '@assets/icons/heartFilled.svg'
import HeartDefault from '@assets/icons/heartDefault.svg'
import DeleteDefault from '@assets/icons/deleteDefault.svg'
import DeleteFilled from '@assets/icons/deleteFilled.svg'
import { postService } from '@shared/services/postService'
import { createApiHandler, handleApiError } from '@shared/utils'
import SafeText from '@shared/components/SafeText'
import { SafeName } from '@shared/components/SafeText'
import logger from '@shared/utils/logger'

const Comment = ({ comment, onDelete, showDeleteAlways = false }) => {
  const [isLiked, setIsLiked] = useState(comment.is_liked)
  const [likeCount, setLikeCount] = useState(comment.likeCountComment || 0)
  const [likeIcon, setLikeIcon] = useState('LikeDefault')
  const [delIcon, setDelIcon] = useState('DelDefault')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setIsLiked(comment.is_liked)
    setLikeCount(comment.likeCountComment || 0)
  }, [comment])

  const handleLikeClick = async () => {
    try {
      const response = isLiked 
        ? await postService.unlikeComment(comment.comment_id)
        : await postService.likeComment(comment.comment_id)

      if (response.data.status === 200) {
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
      } else {
        logger.error('Error liking comment:', response.data.message)
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <div
      className="post__comment"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="post__comment-start">
        <strong>
          {comment.is_current_user ? (
            'Вы'
          ) : (
            <>
              <SafeName name={comment.surname} /> <SafeName name={comment.name} />
            </>
          )}
        </strong>
        <SafeText text={comment.text} preserveLineBreaks={true} />
        <div className="post__comment-timestamp">
          {format(new Date(comment.created_at), 'd MMMM, HH:mm', { locale: ru })}
        </div>
      </div>

      <div className="post__like-container-all">
        {comment.is_current_user && (isHovered || showDeleteAlways) ? (
          <div className="post__like-container-comments">
            <IconButton
              className="padding-2-12"
              onClick={() => onDelete(comment.comment_id)}
              onMouseEnter={() => setDelIcon('DelFilled')}
              onMouseLeave={() => setDelIcon('DelDefault')}
            >
              {delIcon === 'DelFilled' ? (
                <img
                  className="post__icon-action-com width-24"
                  src={DeleteFilled}
                  alt="del"
                />
              ) : (
                <img
                  className="post__icon-action-com width-24"
                  src={DeleteDefault}
                  alt="del"
                />
              )}
            </IconButton>
          </div>
        ) : (
          <div className="height-32"></div>
        )}

        <div className="post__like-container-comments">
          {likeCount > 0 && <div className="post__like-count-comments">{likeCount}</div>}

          <IconButton
            className="padding-2-12"
              onClick={handleLikeClick}
            onMouseEnter={() => setLikeIcon('LikeFilled')}
            onMouseLeave={() => setLikeIcon('LikeDefault')}
          >
            {isLiked || likeIcon === 'LikeFilled' ? (
              <img
                className="post__icon-action-com"
                src={HeartFilled}
                alt="Liked"
                style={{ width: '24px' }}
              />
            ) : (
              <img
                className="post__icon-action-com"
                src={HeartDefault}
                alt="Not Liked"
                style={{ width: '24px' }}
              />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default Comment
