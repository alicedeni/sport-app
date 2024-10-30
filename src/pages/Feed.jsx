import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/main/Header';
import MobileHeader from '../components/main/MobileHeader';
import Posts from '../components/main/Posts';
import axios from 'axios';

import { link } from '../consts.js';

const Feed = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [user, setUser] = useState({
    id: 1,
    last_name: "Иванов",
    first_name: "Иван",
    email: "test@gmail.com",
    height: 170,
    weight: 70,
    target_weight: 10,
    activity: [{ type: 'pool', color: 'blue', time: 16, calories: 8500 }],
    team: "Команда №1",
    teammates: 8,
    league: "gold",
    place_league: 6,
    avatar: "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2345549599.jpg",
  });
  
  const getPostData = (id) => {
    return axios.get(`${link}/user/${id}/posts`, {})
    .then(response => {
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

  const getUserData = () => {
      return axios.get(`${link}/profile/${id}`, {})
          .then(response => {
              return response.data;
          })
          .catch(error => {
              console.error(error);
              throw error;
          });
  };

  useEffect(() => {
    getUserData()
      .then(data => {
        if (data && data.profile) {
          setUser(data.profile);
        }
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container" id="root">
      {isMobile ? (
        <MobileHeader  />
      ) : (
        <Header currentPage="feed"  />
      )}
      <div className="main">
        <Posts posts={posts} />
      </div>
    </div>
  );
};

export default Feed;