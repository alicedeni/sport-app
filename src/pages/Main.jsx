import React, { useState, useEffect } from 'react';
import Header from '../components/main/Header';
import Posts from '../components/main/Posts';
import Challenges from '../components/main/Challenges';
import Ratings from '../components/main/Ratings';
import Activity from '../components/main/Activity';
import axios from 'axios';

const Main = () => {
  const [page, setPage] = useState('feed');
  const [posts, setPosts] = useState([]);

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
    getPostData()
      .then(data => {
        setPosts(data);
      })
      .catch(error => {
        console.error(error);
      });
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