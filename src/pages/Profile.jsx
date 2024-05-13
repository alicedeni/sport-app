import React, { useState, useEffect } from 'react';
import ProfileBlock from '../components/ProfileBlock';
import axios from 'axios';
import Header from '../components/main/Header';

const Profile = () => {
    const [page, setPage] = React.useState('feed');
    const [user, setUser] = useState({
        id: 1,
        lastName: "Иванов",
        firstName: "Иван",
        email: "test@gmail.com",
        height: 170,
        weight: 70,
        // progress
        activity: [{type: 'pool', color: 'blue', time: 16, calories: 8500},],
        team: 1,
        league: "gold",
        avatar: "https://i.pinimg.com/736x/19/dd/ac/19ddacef8e14946b73248fe5b20338b0.jpg",
    });

    const getUserData = () => {
        return axios.get('http://localhost:5000/user', {})
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error(error);
                throw error;
            });
    };

    useEffect(() => {
        getUserData().then(data => setUser(data)).catch(error => console.error(error));
    }, []);


  return (
    <div className="container">
      <Header setPage={setPage} isFeedPage={false}/>
      <div className="main"><ProfileBlock user={user}/></div>
    </div>
  );
};

export default Profile;


