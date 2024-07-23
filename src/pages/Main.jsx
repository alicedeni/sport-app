import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/main/Header';
import Posts from '../components/main/Posts';
import Challenges from '../components/main/Challenges';
import Ratings from '../components/main/Ratings';
import Activity from '../components/main/Activity';
import Preview from '../components/main/Preview';
import axios from 'axios';

import { link } from '../consts.js';

const Main = () => {
  const [page, setPage] = useState('feed');
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      miniAvatar: 'https://example.com/avatar1.jpg', 
      username: 'User 1', 
      timestamp: '2023-03-12T10:00:00.000Z', 
      fireCount: 10, 
      image: 'https://www.meme-arsenal.com/memes/8b870fc24daef3a08f8a4548690e82ea.jpg', 
      type: 'КАРДИОТРЕНИРОВКА', 
      tag: 'cardio',
      time: '10', 
      calories: '100', 
      text: 'This is post 1.', 
    }, 
    { 
      id: 2, 
      miniAvatar: 'https://example.com/avatar2.jpg', 
      username: 'User 2 Ultra Long Name', 
      timestamp: '2023-03-12T11:00:00.000Z', 
      fireCount: 5, 
      image: 'https://cdn.ren.tv/cache/1200x630/media/img/a6/b1/a6b191be8fdbf7faf743623ea34d5262dd4fb87c.jpg', 
      type: 'СПОРТИВНЫЕ ИГРЫ', 
      tag: 'game',
      time: '5', 
      calories: '50', 
      text: 'This is post 2.',
    }, 
  ]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    if (location.state && location.state.page) {
      setPage(location.state.page);
    }
  }, [location.state]);

  const getPostData = () => {
    return axios.get(`${link}/posts`, {})
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
  };

  useEffect(() => {
    getPostData()
      .then(data => {
        if (data && data.posts) {
          setPosts(data.posts);
        }
      })
      .catch(error => console.error(error));
  }, []);

  let content;

  switch (page) {
    case 'feed':
      content = <Posts posts={posts} setPage={setPage} isFeedPage={true} />;
      console.log(new URLSearchParams(location.search));
      break;
    case 'challenges':
      content = <Challenges setPage={setPage} isFeedPage={false} />;
      console.log(new URLSearchParams(location.search));
      break;
    case 'ratings':
      content = <Ratings setPage={setPage} isFeedPage={false} />;
      console.log(new URLSearchParams(location.search));
      break;
    case 'activity':
      content = <Activity setPage={setPage} isFeedPage={false} />;
      console.log(new URLSearchParams(location.search));
      break;
    case 'view':
      content = <Preview setPage={setPage} isFeedPage={false} activityData={location.state.activityData}  />;
      break;
    default:
      content = <Posts posts={posts} setPage={setPage} isFeedPage={true} />;
  }

  return (
    <div className="container" id="root">
      <Header setPage={setPage} isFeedPage={page === 'feed'}/>
      <div className="main">{content}</div>
    </div>
  );
};

export default Main;