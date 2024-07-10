import React, { useState, useEffect } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { Favorite, FavoriteBorder, Comment } from '@material-ui/icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import ReactDOM from 'react-dom';
import axios from 'axios';
import CommentDefault from '../../assets/icons/commentDefault.svg';
import HeartFilled from '../../assets/icons/heartFilled.svg';
import HeartDefault from '../../assets/icons/heartDefault.svg';
import CommentFilled from '../../assets/icons/commentFilled.svg';
import SendDefault from '../../assets/icons/sendDefault.svg';
import SendFilled from '../../assets/icons/sendFilled.svg';

import {link} from '../../consts.js';

ReactDOM.findDOMNode = () => {};
ReactDOM.createPortal = () => {};

const Post = ({ post }) => {
  const [isCommentOpen, setIsCommentOpen] = React.useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [sendIcon, setSendIcon] = useState('SendDefault');

  console.log(post); 

  useEffect(() => {
    axios.get(`${link}/get_comments/${post.feed_id}`)
      .then(response => {
        if (response.data.status === 200) {
          setComments(response.data.comments);
          setCommentCount(response.data.comments.length);
        } else {
          console.error('Error fetching comments:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  }, [post.feed_id]);

  const handleLikeClick = () => {
    const likeData = {
      post_id: post.feed_id,
    };
    
    if (isLiked) {
      axios.post(`${link}/unlike`, likeData)
        .then(response => {
          if (response.data.status === 200) {
            setIsLiked(false);
            setLikeCount(likeCount - 1);
          } else {
            console.error('Error unliking post:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error unliking post:', error);
        });
    } else {
      // лайк
      axios.post(`${link}/like`, likeData)
        .then(response => {
          if (response.data.status === 200) {
            setIsLiked(true);
            setLikeCount(likeCount + 1);
          } else {
            console.error('Error liking post:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error liking post:', error);
        });
    }
  };

  // проверка на авторство комментария
  // const handleCommentClick = () => {
  //   setIsCommentOpen(!isCommentOpen);
  // };
  
  const handleCommentClick = () => {
    if (!isCommentOpen) {
      axios.get(`${link}/get_comments/${post.feed_id}`)
        .then(response => {
          if (response.data.status === 200) {
            setComments(response.data.comments);
          } else {
            console.error('Error fetching comments:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error fetching comments:', error);
        });
    }
    setIsCommentOpen(!isCommentOpen);
  };
  
  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = () => {
    const commentData = {
      post_id: post.feed_id,
      comment_text: commentText,
    };
    
    axios.post(`${link}/comment`, commentData)
      .then(response => {
        if (response.data.status === 200) {
          setComments([...comments, { text: commentText, surname: 'Вы' }]);
          setCommentText('');
          setCommentCount(commentCount + 1);
        } else {
          console.error('Error commenting on post:', response.data.message);
        }
      })
      .catch(error => console.error('Error commenting on post:', error));
  };

  const handleSendIconHover = (isHovered) => {
    setSendIcon(isHovered ? 'SendFilled' : 'SendDefault');
  };
  
  return (
    <div className="post">
      <div className="post__header">
        {post.miniAvatar ? ( 
          <Avatar className="post__mini-avatar" src={`${link}/${post.miniAvatar}`} alt="avatar" />
        ) : (
          <Avatar className="post__mini-avatar" src={post.miniAvatar} alt="avatar" />
        )}
        <div className="post__user-info">
          <div className="post__svg-fire-container">
            <div className="post__username">{post.username}</div>
            <svg width="21" height="27" viewBox="0 0 21 27" fill="none" xmlns="http://www.w3.org/2000/svg" className="post__svg-fire-container-svg">
              <path d="M0.75 16C0.75 24 8.25 27.6251 9 26.5C9.5 25.75 7.7124 25.7444 8.25 22.25C8.75 19 13 16 12.5 18.25C11.9166 20.8754 13.7067 20.6534 14 23C14.3277 25.6219 12.5632 25.6266 13 26.5C13.559 27.6181 21 24.5 21 16.75C21 10.5 19 9 18.25 9C17.5 9 18.65 10.25 17.25 12C16.65 12.75 15.7007 13.3521 15.5 12.75C15.25 12 17 11.25 15.75 6.75009C14.8573 3.5364 11 0.499976 10 0.750042C9 1.00011 9.75 2.55 9.75 3.75C9.75 5.75 8.62495 6.00011 7.5 8.25C5.75 11.75 8 13.6251 7.25 14C6.5 14.3749 5 12.5177 5 10.75C5 8.5 6.25 7.5 5.75 7C5.25 6.5 0.75 8.00004 0.75 16Z" fill="url(#paint0_linear_101_308)"/>
              <defs>
              <linearGradient id="paint0_linear_101_308" x1="0.75" y1="26.7205" x2="23.6352" y2="24.1442" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9D9DE6"/>
              <stop offset="0.427083" stopColor="#567FE3"/>
              <stop offset="0.885417" stopColor="#9664C8"/>
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
      <div className="post__content">
        <div className="post__image-container">
          {/* <img className="post__image" src={post.image} alt="Post image" /> */}
          <img className="post__image" src={`${link}/${post.image}`} alt="Post image" />
        </div>
        <div className="post__info">
          <div className="post__title">
          <div id={post.tag} className={`activity-tags ${post.tag}-L`}>
                  {post.type.toUpperCase()}
                </div>
          </div>
          {/* {post.tag && post.type ? (
              <div id={post.tag} className={`activity-btn ${post.tag}-bold`}>
                {post.type.toUpperCase()}
              </div>
            ) : (
              <div className="activity-btn">Unknown Type</div>
            )}
          </div> */}
          <div className="post__points">
            <div className="post__points__point"> Время
              {/* <div className="post__time"> */}
              <div className={`post__metric ${post.tag}-metric`}>
                {post.time && (
                    <div className="formatted-time">
                        {(() => {
                            const [hours, minutes] = post.time.split(':').map(Number);
                            let totalHours = hours + Math.round(minutes / 60 * 2) / 2;
                            let hour = Math.floor(totalHours);
                            if (hour !== 0) {
                              return <span>{totalHours} часа</span>;
                            } else {
                              return <span>{minutes} мин</span>;
                            }
                        })()}
                    </div>
                )}
              </div>
            </div>
            <div className="post__points__point">
              Калории
              {/* <div className="post__calories">{post.calories} ккал</div> */}
              <div className={`post__metric ${post.tag}-metric`}>{post.calories} ккал</div>
            </div>
          </div>
          <div className="post__line"></div>
          <div className="post__text">{post.text}</div>
        </div>
      </div>
      <div className="post__actions">
        <div className="post__like-container">
          <div className="post__like-count">{likeCount}</div>
          <IconButton onClick={handleLikeClick}>
            {isLiked ? <img src={HeartFilled} alt="Liked" /> : <img src={HeartDefault} alt="Not Liked" />}
          </IconButton>
        </div>
        <div className="post__comment-container">
          <div className="post__comment-count">{commentCount}</div>
          <IconButton onClick={handleCommentClick}>
            {isCommentOpen ? <img src={CommentFilled} alt="Commented" /> : <img src={CommentDefault} alt="Not Commented" />}
          </IconButton>
        </div>
      </div>
        <div className="post__comment-containerinput">
          {isCommentOpen && (
            <div className="post__comment-section">
              <textarea
                  className="post__comment-input"
                  placeholder="Написать комментарий..."
                  value={commentText}
                  onChange={handleCommentChange}
                  rows={1}
              />
              <IconButton
                className="post__comment-input-btn"
                onClick={handleCommentSubmit}
                onMouseEnter={() => handleSendIconHover(true)}
                onMouseLeave={() => handleSendIconHover(false)}
              >
                  {sendIcon === 'SendDefault' ? (
                      <img src={SendDefault} alt="Send" />
                  ) : (
                      <img src={SendFilled} alt="Send" />
                  )}
              </IconButton>
              {comments.length > 0 && (
                <div className="post__comments">
                  {comments.map((comment, index) => (
                    <div key={index} className="post__comment">
                      <strong>{comment.surname}{comment.name}</strong>: {comment.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
};

export default Post;

