import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Favorite, FavoriteBorder, Comment } from '@material-ui/icons';
import { ButtonEnter } from "../Buttons";
import { Avatar, IconButton } from '@material-ui/core';
import axios from 'axios';
import ReactDOM from 'react-dom';

import { link } from '../../consts.js';

ReactDOM.findDOMNode = () => {};
ReactDOM.createPortal = () => {};

const Preview = () => {
    const [page, setPage] = useState('feed');
    const { state } = useLocation();
    const { activityData } = state;
    const navigate = useNavigate();
    const [post, setPost] = useState(
    { 
        id: 1, 
        miniAvatar: 'https://example.com/avatar1.jpg', 
    })
{/* 
    const handlePublish = () => {
      if (!activityData) {
        console.error('Данные активности отсутствуют');
        return;
      }
      axios.post(`${link}/activities`, activityData)
        .then(response => {
          if (response.data.status === 200) {
            console.log('Активность успешно опубликована');
            window.location.href = '/main';
          } else {
            console.error('Ошибка при публикации активности:', response.data.error);
          }
        })
        .catch(error => {
          console.error(error);
        });
    };
  */}
    const handleBack = () => {
      if (activityData) {
        navigate('/main', { state: { page: 'activity', formState: 'add' } });
      } else {
        console.error('Данные активности отсутствуют');
      }
    };
  
    return (
        <div className="preview">
            <div className="preview-return">
              <button className="preview-return__prev" onClick={handleBack}>
                &lt;
              </button>
              <div>Публикация активности</div>
            </div>
        <div className="preview-post">
            <div className="preview-post__header">
                {post.miniAvatar ? ( 
                <Avatar className="preview-post__mini-avatar" src={`${link}/${post.miniAvatar}`} alt="avatar" />
                ) : (
                <Avatar className="preview-post__mini-avatar" src={post.miniAvatar} alt="avatar" />
                )}
                <div className="preview-post__user-info">
                <div className="preview-post__svg-fire-container">
                    <div className="preview-post__username">{post.username}</div>
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
                    <div className="preview-post__fire-count">{post.fireCount}</div>
                </div>
                <div className="preview-post__timestamp">
                    Предпросмотр
                </div>
                </div>
            </div>
            <div className="preview-post__content">
                <div className="preview-post__image-container">
                {activityData && (
                <img className="preview-post__image" src={`activityData.image`} alt="Post image" />)}
                </div>
                <div className="preview-post__info">
                <div className="preview-post__title">
                {/* !!! */}
                {activityData && (
                <div id={post.tag} className={`activity-btn ${post.tag}-bold`}>
                        {activityData.type.toUpperCase()}
                        </div>
                )}
                </div>
                <div className="preview-post__points">
                    <div className="preview-post__points__point"> Время
                    <div className="preview-post__time">
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
                    <div className="preview-post__points__point">
                    Калории
                    {activityData && (
                    <div className="preview-post__calories">{activityData.calories} ккал</div>
                    )}
                    </div>
                </div>
                <div className="preview-post__line"></div>
                {activityData && (
                <div className="preview-post__text">{activityData.description}</div>
                )}
                </div>
            </div>
        </div>
        
        <div className="preview-submit_btn">
            <ButtonEnter
              className="welcome-block__btn"
              text="Опубликовать"
              type="submit"
              textContent={"Опубликовать"}
              onClick={handlePublish}
            />
          </div>
      </div>
    );
  
  };
  
  export default Preview;