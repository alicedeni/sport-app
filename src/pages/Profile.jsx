import React from 'react';
import ProfileBlock from '../components/ProfileBlock';
import Header from '../components/main/Header';

const Profile = () => {
    const [page, setPage] = React.useState('feed');
    const user = {
        id: 1,
        lastName: "Иванов",
        firstName: "Иван",
        email: "test@gmail.com",
        height: 170,
        weight: 70,
        // progress
        team: 1,
        league: "gold",
        avatar: "https://i.pinimg.com/736x/19/dd/ac/19ddacef8e14946b73248fe5b20338b0.jpg",
    }

    return (
        <div className="container">
            <Header setPage={setPage} isFeedPage={false}/>
            <div className="main"><ProfileBlock user={user}/></div>
        </div>
    );
};

export default Profile;