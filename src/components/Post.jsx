import React, { useState } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { Favorite, FavoriteBorder, Comment } from '@material-ui/icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import ReactDOM from 'react-dom';
import { ReactComponent as CommentDefaultIcon } from '../assets/icons/commentDefault.svg';
import { ReactComponent as HeartDefaultIcon } from '../assets/icons/heartDefault.svg';

ReactDOM.findDOMNode = () => {};
ReactDOM.createPortal = () => {};

const Post = ({ post }) => {
  const [isCommentOpen, setIsCommentOpen] = React.useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const handleLikeClick = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    }
  };
  const handleCommentClick = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__mini-avatar" src={post.miniAvatar} alt="avatar" />
        <div className="post__user-info">
          <div className="post__svg-fire-container">
            <div className="post__username">{post.username}</div>
            <svg width="21" height="27" viewBox="0 0 21 27" fill="none" xmlns="http://www.w3.org/2000/svg" className="post__svg-fire-container-svg">
              <path d="M0.75 16C0.75 24 8.25 27.6251 9 26.5C9.5 25.75 7.7124 25.7444 8.25 22.25C8.75 19 13 16 12.5 18.25C11.9166 20.8754 13.7067 20.6534 14 23C14.3277 25.6219 12.5632 25.6266 13 26.5C13.559 27.6181 21 24.5 21 16.75C21 10.5 19 9 18.25 9C17.5 9 18.65 10.25 17.25 12C16.65 12.75 15.7007 13.3521 15.5 12.75C15.25 12 17 11.25 15.75 6.75009C14.8573 3.5364 11 0.499976 10 0.750042C9 1.00011 9.75 2.55 9.75 3.75C9.75 5.75 8.62495 6.00011 7.5 8.25C5.75 11.75 8 13.6251 7.25 14C6.5 14.3749 5 12.5177 5 10.75C5 8.5 6.25 7.5 5.75 7C5.25 6.5 0.75 8.00004 0.75 16Z" fill="url(#paint0_linear_101_308)"/>
              <defs>
              <linearGradient id="paint0_linear_101_308" x1="0.75" y1="26.7205" x2="23.6352" y2="24.1442" gradientUnits="userSpaceOnUse">
              <stop stop-color="#9D9DE6"/>
              <stop offset="0.427083" stop-color="#567FE3"/>
              <stop offset="0.885417" stop-color="#9664C8"/>
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
          <img className="post__image" src={post.image} alt="Post image" />
        </div>
        <div className="post__info">
          <div className="post__title">{post.title}</div>
          <div>
            <div className="post__time">{post.time} мин</div>
            <div className="post__calories">{post.calories} ккал</div>
          </div>
          <div className="post__text">{post.text}</div>
        </div>
      </div>
      <div className="post__actions">
        <div className="post__like-container">
          <IconButton onClick={handleLikeClick}>
            {isLiked ? <Favorite color="secondary" /> : <FavoriteBorder />}
          </IconButton>
          <div className="post__like-count">{post.likeCount}</div>
        </div>
        <div className="post__comment-container">
          <IconButton onClick={handleCommentClick}>
            <Comment />
          </IconButton>
          {isCommentOpen && <input className="post__comment-input" placeholder="Написать комментарий..." />}
        </div>
      </div>
    </div>
  );
};

export default Post;