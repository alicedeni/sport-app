import React, { useState, useEffect, useRef } from 'react'
import { Avatar, IconButton } from '@material-ui/core'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import ReactDOM from 'react-dom'
import axios from 'axios'
import CommentDefault from '../../assets/icons/commentDefault.svg'
import HeartFilled from '../../assets/icons/heartFilled.svg'
import HeartDefault from '../../assets/icons/heartDefault.svg'
import CommentFilled from '../../assets/icons/commentFilled.svg'
import SendDefault from '../../assets/icons/sendDefault.svg'
import SendFilled from '../../assets/icons/sendFilled.svg'
import Comment from './Comment'
import CommentDrawer from './CommentDrawer'
import ImageModal from './ImageModal'

import { link } from '../../consts.js'

ReactDOM.findDOMNode = () => {}
ReactDOM.createPortal = () => {}

const Post = ({ post }) => {
  const [isCommentOpen, setIsCommentOpen] = React.useState(false)
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(post.comments || [])
  const [commentCount, setCommentCount] = useState(post.commentCount || 0)
  const [sendIcon, setSendIcon] = useState('SendDefault')
  const [likeIcon, setLikeIcon] = useState('LikeDefault')
  const [comIcon, setComIcon] = useState('ComDefault')
  const hasImage = post && post.image
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [enlargedImageUrl, setEnlargedImageUrl] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [tagSize, setTagSize] = useState('L')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820)

  const imageContainerRef = useRef(null)
  const infoContainerRef = useRef(null)

  const updateImageHeight = () => {
    if (window.innerWidth > 820 && infoContainerRef.current && imageContainerRef.current) {
      const infoHeight = infoContainerRef.current.offsetHeight
      imageContainerRef.current.style.height = `${infoHeight}px`
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820)
    }

    window.addEventListener('resize', handleResize)

    setTagSize(isMobile ? 'S' : 'L')

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobile])

  useEffect(() => {
    setTagSize(isMobile ? 'S' : 'L')
  }, [isMobile])

  useEffect(() => {
    const updateHeightWithDelay = () => {
      setTimeout(() => {
        if (window.innerWidth > 820) {
          updateImageHeight()
        }
      }, 100)
    }

    updateHeightWithDelay()

    const handleResize = () => {
      if (window.innerWidth > 820) {
        updateImageHeight()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleLikeClick = () => {
    const likeData = {
      post_id: post.feed_id,
    }
    const token = localStorage.getItem('token')
    if (isLiked) {
      axios
        .post(`${link}/user/unlike`, likeData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.status === 200) {
            setIsLiked(false)
            setLikeCount(likeCount - 1)
          } else {
            console.error('Error unliking post:', response.data.message)
          }
        })
        .catch((error) => {
          console.error('Error unliking post:', error)
        })
    } else {
      // лайк
      axios
        .post(`${link}/user/like`, likeData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.status === 200) {
            setIsLiked(true)
            setLikeCount(likeCount + 1)
          } else {
            console.error('Error liking post:', response.data.message)
          }
        })
        .catch((error) => {
          console.error('Error liking post:', error)
        })
    }
  }

  const handleDeleteClick = async (commentId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.delete(`${link}/user/delete_comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.status === 200) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.comment_id !== commentId),
        )
        setCommentCount(commentCount - 1)
      } else {
        console.error('Error deleting comment:', response.data.message)
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleCommentClick = () => {
    if (!isCommentOpen) {
      const token = localStorage.getItem('token')
      axios
        .get(`${link}/get_comments/${post.feed_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.status === 200) {
            setComments(response.data.comments)
          } else {
            console.error('Error fetching comments:', response.data.message)
          }
        })
        .catch((error) => {
          console.error('Error fetching comments:', error)
        })
    }
    setIsCommentOpen(!isCommentOpen)
  }

  const handleCommentChange = (event) => {
    setCommentText(event.target.value)
  }

  const fetchComments = () => {
    const token = localStorage.getItem('token')
    axios
      .get(`${link}/get_comments/${post.feed_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.status === 200) {
          setComments(response.data.comments)
        } else {
          console.error('Error fetching comments:', response.data.message)
        }
      })
      .catch((error) => {
        console.error('Error fetching comments:', error)
      })
  }

  const handleCommentSubmit = () => {
    if (commentText.trim() === '') return
    const commentData = {
      post_id: post.feed_id,
      comment_text: commentText,
    }
    const token = localStorage.getItem('token')
    axios
      .post(`${link}/user/comment`, commentData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.status === 200) {
          fetchComments()
          setCommentText('')
          setCommentCount(commentCount + 1)
        } else {
          console.error('Error commenting on post:', response.data.message)
        }
      })
      .catch((error) => console.error('Error commenting on post:', error))
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleCommentSubmit()
    }
  }

  const handleSendIconHover = (isHovered) => {
    setSendIcon(isHovered ? 'SendFilled' : 'SendDefault')
  }

  const handleImageClick = () => {
    setEnlargedImageUrl(post.image)
    setIsModalOpen(true)
  }

  return (
    <div className="post">
      <div className="post__header">
        {post.miniAvatar ? (
          <Avatar className="post__mini-avatar" src={post.miniAvatar} alt="avatar" />
        ) : (
          <Avatar className="post__mini-avatar" src={post.miniAvatar} alt="avatar" />
        )}
        <div className="post__user-info">
          <div className="post__svg-fire-container">
            <div className="post__username">{post.username + ' ' + post.name}</div>
            <svg
              width="32"
              height="32"
              className="post__svg-icon"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.4006 27.6937C17.2411 28.0524 17.5086 28.4685 17.8968 28.411C22.6002 27.7139 25.5 23.5418 25.5 18.4992C25.5 15.9861 25.0965 12.13 22.3843 10.1754C22.2387 10.0705 22.0486 10.2362 22.1055 10.407C22.4411 11.4139 22.5 13.5 21.5 13.5C20.5 13.5 20.89 12.4781 20.6806 11.3092C20.5567 10.6172 20.4079 9.78662 20.0714 8.94027C19.2108 6.7753 17.5314 3.78656 12.6971 3.50027C12.5065 3.48898 12.3798 3.83213 12.4962 3.9845C13.9003 5.82401 14.5101 11.5 12.5 11.5C11.2779 11.5 11.4041 9.37078 12.1256 7.67401C12.1963 7.50762 12.0142 7.34151 11.8633 7.44003C6.92323 10.6652 6.5 15.9253 6.5 18.4992C6.5 23.5418 9.39983 27.7139 14.1032 28.411C14.4914 28.4685 14.7589 28.0524 14.5994 27.6937C14.1613 26.7084 13.7381 25.3583 13.7381 23.8689C13.7381 20.32 15.3235 18.7871 15.7965 18.044C15.8945 17.89 16.1055 17.89 16.2035 18.044C16.6765 18.7871 18.2619 20.32 18.2619 23.8689C18.2619 25.3583 17.8387 26.7084 17.4006 27.6937Z"
                fill="url(#paint0_linear_1096_2207)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1096_2207"
                  x1="6.5"
                  y1="28.5"
                  x2="27.9857"
                  y2="26.1412"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9D9DE6" />
                  <stop offset="0.427083" stopColor="#567FE3" />
                  <stop offset="0.885417" stopColor="#9664C8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="post__fire-count">{post.fireCount}</div>
          </div>
          <div className="post__timestamp">
            {format(new Date(post.timestamp), 'd MMMM, HH:mm', { locale: ru })}
          </div>
        </div>
      </div>
      <div className={`post__content`}>
        <div className={`post__image-container`} ref={imageContainerRef}>
          {/* <img className="post__image" src={post.image} alt="Post image" /> */}
          {hasImage ? (
            <div
              className="post__image-wrapper"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                className="post__image"
                src={post.image}
                alt="Post image"
                onClick={handleImageClick}
              />
              {isHovered && (
                <div
                  className="post__zoom-button"
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                  onClick={handleImageClick}
                >
                  <img
                    src={
                      isButtonHovered
                        ? 'https://storage.yandexcloud.net/team2go/users/base/zoomHover.svg'
                        : 'https://storage.yandexcloud.net/team2go/users/base/zoomDefault.svg'
                    }
                    alt="Zoom"
                  />
                </div>
              )}
            </div>
          ) : (
            <img
              className="post__image"
              src={`https://storage.yandexcloud.net/team2go/users/base/${post.tag}.svg`}
              alt={`${post.tag} activity`}
            />
          )}
        </div>
        <div className="post__info" ref={infoContainerRef}>
          <div className="post__title">
            <div id={post.tag} className={`activity-tags ${post.tag}-${tagSize}`}>
              {post.type && post.type.toUpperCase()}
            </div>
            <div className="post__title-fire">
              <div>
                <div className="post__title-fire-count">{post.postfireCount}</div>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="post__svg-icon"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.4006 27.6937C17.2411 28.0524 17.5086 28.4685 17.8968 28.411C22.6002 27.7139 25.5 23.5418 25.5 18.4992C25.5 15.9861 25.0965 12.13 22.3843 10.1754C22.2387 10.0705 22.0486 10.2362 22.1055 10.407C22.4411 11.4139 22.5 13.5 21.5 13.5C20.5 13.5 20.89 12.4781 20.6806 11.3092C20.5567 10.6172 20.4079 9.78662 20.0714 8.94027C19.2108 6.7753 17.5314 3.78656 12.6971 3.50027C12.5065 3.48898 12.3798 3.83213 12.4962 3.9845C13.9003 5.82401 14.5101 11.5 12.5 11.5C11.2779 11.5 11.4041 9.37078 12.1256 7.67401C12.1963 7.50762 12.0142 7.34151 11.8633 7.44003C6.92323 10.6652 6.5 15.9253 6.5 18.4992C6.5 23.5418 9.39983 27.7139 14.1032 28.411C14.4914 28.4685 14.7589 28.0524 14.5994 27.6937C14.1613 26.7084 13.7381 25.3583 13.7381 23.8689C13.7381 20.32 15.3235 18.7871 15.7965 18.044C15.8945 17.89 16.1055 17.89 16.2035 18.044C16.6765 18.7871 18.2619 20.32 18.2619 23.8689C18.2619 25.3583 17.8387 26.7084 17.4006 27.6937Z"
                    fill="url(#paint0_linear_1096_2207)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_1096_2207"
                      x1="6.5"
                      y1="28.5"
                      x2="27.9857"
                      y2="26.1412"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#9D9DE6" />
                      <stop offset="0.427083" stopColor="#567FE3" />
                      <stop offset="0.885417" stopColor="#9664C8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          <div className="post__points">
            {post && post.activityDate && post.timeBeginning && (
              <div className="post__points__point">
                Дата активности
                <div className={`post__metric`}>
                  {format(
                    new Date(`${post.activityDate}T${post.timeBeginning}:00`),
                    'd MMM, HH:mm',
                    { locale: ru },
                  )}
                </div>
              </div>
            )}
            {post && post.time && (
              <div className="post__points__point">
                Время
                {/* <div className="post__time"> */}
                <div className={`post__metric`}>
                  {post.time && (
                    <div className="formatted-time">
                      {(() => {
                        const [hours, minutes] = post.time.split(':').map(Number)
                        if (minutes === 0) {
                          return <span>{`${hours} ч`}</span>
                        } else if (hours > 0) {
                          return <span>{`${hours} ч ${minutes} мин`}</span>
                        } else {
                          return <span>{`${minutes} мин`}</span>
                        }
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}
            {post && post.calories && (
              <div className="post__points__point">
                Калории
                <div className={`post__metric`}>{post.calories} ккал</div>
              </div>
            )}
            {post && post.step && (
              <div className="post__points__point">
                Шаги
                <div className={`post__metric`}>{post.step} шагов</div>
              </div>
            )}
            {post && post.distance && (
              <div className="post__points__point">
                Дистанция
                <div className={`post__metric`}>
                  {isNaN(Number(post.distance))
                    ? '-'
                    : Number.isInteger(Number(post.distance))
                      ? Number(post.distance)
                      : Number(post.distance).toFixed(1)}{' '}
                  {post.tag === 'pool' ? 'м' : 'км'}
                </div>
              </div>
            )}
          </div>
          {post && post.text && <div className="post__line"></div>}
          <div className="post__text">{post.text}</div>
        </div>
      </div>
      <div className="post__actions">
        <div className="post__comment-container">
          <div className="post__comment-count">{commentCount}</div>
          <IconButton
            onClick={handleCommentClick}
            onMouseEnter={() => setComIcon('ComFilled')}
            onMouseLeave={() => setComIcon('ComDefault')}
          >
            {isCommentOpen || comIcon === 'ComFilled' ? (
              <img className="post__icon-action" src={CommentFilled} alt="Commented" />
            ) : (
              <img className="post__icon-action" src={CommentDefault} alt="Not Commented" />
            )}
          </IconButton>
        </div>
        <div className="post__like-container" style={{ marginRight: '-12px' }}>
          <div className="post__like-count">{likeCount}</div>
          <IconButton
            onClick={handleLikeClick}
            onMouseEnter={() => setLikeIcon('LikeFilled')}
            onMouseLeave={() => setLikeIcon('LikeDefault')}
          >
            {isLiked || likeIcon === 'LikeFilled' ? (
              <img className="post__icon-action" src={HeartFilled} alt="Liked" />
            ) : (
              <img className="post__icon-action" src={HeartDefault} alt="Not Liked" />
            )}
          </IconButton>
        </div>
      </div>

      {isMobile && (
        <CommentDrawer
          isOpen={isCommentOpen}
          onClose={() => setIsCommentOpen(false)}
          comments={comments}
          commentText={commentText}
          onCommentChange={(e) => setCommentText(e.target.value)}
          onSubmit={handleCommentSubmit}
          onDelete={handleDeleteClick}
          commentCount={commentCount}
        />
      )}

      {!isMobile && isCommentOpen && (
        <div className="post__comment-containerinput">
          <div className="post__comment-section">
            {comments.length > 0 && (
              <div className="post__comments">
                {comments.map((comment, index) => (
                  <Comment key={index} comment={comment} onDelete={handleDeleteClick} />
                ))}
              </div>
            )}
            <textarea
              className="post__comment-input"
              placeholder="Написать комментарий..."
              style={{ marginTop: '20px' }}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={250}
            />
            <IconButton
              className="post__comment-input-btn"
              onClick={handleCommentSubmit}
              onMouseEnter={() => setSendIcon('SendFilled')}
              onMouseLeave={() => setSendIcon('SendDefault')}
            >
              {sendIcon === 'SendDefault' ? (
                <img className="post__icon-action" src={SendDefault} alt="Send" />
              ) : (
                <img className="post__icon-action" src={SendFilled} alt="Send" />
              )}
            </IconButton>
          </div>
        </div>
      )}
      {isModalOpen && (
        <ImageModal imageUrl={enlargedImageUrl} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}

export default Post
