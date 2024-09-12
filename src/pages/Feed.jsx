import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Posts from '../components/main/Posts';
import Header from '../components/main/Header';
import axios from 'axios';
import { link } from '../consts.js';

const Feed = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  
  const getPostData = (id) => {
    return axios.get(`${link}/user/${id}/posts`, {})
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
    getPostData(id)
      .then(data => {
        if (data && data.posts) {
          setPosts(data.posts);
        }
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container" id="root">
      <Header currentPage="feed" />
      <div className="main">
        <Posts posts={posts} />
      </div>
    </div>
  );
};

export default Feed;