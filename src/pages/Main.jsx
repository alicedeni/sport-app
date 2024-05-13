import React, { useState, useEffect } from 'react';
import Header from '../components/main/Header';
import Posts from '../components/main/Posts';
import Challenges from '../components/main/Challenges';
import Ratings from '../components/main/Ratings';
import Activity from '../components/main/Activity';
import axios from 'axios';

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
      title: 'Post 1', 
      time: '10', 
      calories: '100', 
      text: 'This is post 1.', 
      isLiked: false, 
      likeCount: 10, 
    }, 
    { 
      id: 2, 
      miniAvatar: 'https://example.com/avatar2.jpg', 
      username: 'User 2 Ultra Long Name', 
      timestamp: '2023-03-12T11:00:00.000Z', 
      fireCount: 5, 
      image: 'https://cdn.ren.tv/cache/1200x630/media/img/a6/b1/a6b191be8fdbf7faf743623ea34d5262dd4fb87c.jpg', 
      title: 'Post 2', 
      time: '5', 
      calories: '50', 
      text: 'This is post 2.', 
      isLiked: true, 
      likeCount: 5, 
    }, 
  ]);

  const getPostData = () => {
    return axios.get('http://localhost:5000/posts', {})
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
  };

  useEffect(() => {
    getPostData().then(data => setPosts(data)).catch(error => console.error(error));
}, []);

  let content;

  switch (page) {
    case 'feed':
      content = <Posts posts={posts} setPage={setPage} isFeedPage={true} />;
      break;
    case 'challenges':
      content = <Challenges setPage={setPage} isFeedPage={false} />;
      break;
    case 'ratings':
      content = <Ratings setPage={setPage} isFeedPage={false} />;
      break;
    case 'activity':
      content = <Activity setPage={setPage} isFeedPage={false} />;
      break;
    default:
      content = <Posts posts={posts} setPage={setPage} isFeedPage={true} />;
  }

  return (
    <div className="container">
      <Header setPage={setPage} isFeedPage={page === 'feed'}/>
      <div className="main">{content}</div>
    </div>
  );
};

export default Main;