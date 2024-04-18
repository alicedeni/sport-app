import React from 'react';
import Header from '../components/main/Header';
import ProfileBlock from '../components/ProfileBlock';

const Profile = () => {
    const user = {
        id: 1,
        lastName: "Иванов",
        firstName: "Иван",
        email: "test@gmail.com"
      }

    return (
        <div className="container">
            <Header />
            <ProfileBlock user={user}/>
        </div>
    );
};

export default Profile;