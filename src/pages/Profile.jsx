import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileBlock from '../components/ProfileBlock';
import axios from 'axios';
import Header from '../components/main/Header';
import { link } from '../consts.js';

const Profile = () => {
    const { id } = useParams();
    const [page, setPage] = useState('feed');
    const [user, setUser] = useState({
        id: 1,
        lastName: "Иванов",
        firstName: "Иван",
        email: "test@gmail.com",
        height: 170,
        weight: 70,
        target_weight: 10,
        activity: [{ type: 'pool', color: 'blue', time: 16, calories: 8500 }],
        team: "Команда №1",
        teammates: 8,
        league: "gold",
        place_league: 6,
        avatar: "https://i.pinimg.com/736x/19/dd/ac/19ddacef8e14946b73248fe5b20338b0.jpg",
    });
 
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
            console.log(data.profile)
            setUser(data.profile);
          }
        })
        .catch(error => console.error(error));
    }, []);
  return (
    <div className="container">
      <Header setPage={setPage} isFeedPage={false}/>
      <div className="main"><ProfileBlock user={user} setUser={setUser}/></div>
    </div>
  );
};

export default Profile;