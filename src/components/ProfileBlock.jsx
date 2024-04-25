import React from 'react';

const ProfileBlock = ({ user }) => {
  return (
    <div className="profile-block">
      <img src={user.avatar} alt={user.name} className="profile-block-avatar" />
      <span className="profile-block-name">{`${user.lastName} ${user.firstName}`}</span>
      
      <div className="profile-block-content">
        <div className="profile-block-content-data">
          <div className="profile-block-content-data-title">Мои данные</div>
          <div className="profile-block-content-data-item">
            <div className="profile-block-content-data-item-oval">
              <p className="profile-block-content-data-item-oval-text">{user.height}</p>
            </div>
            <p className="profile-block-content-data-item-text">Рост</p>
          </div>
          <div className="profile-block-content-data-item">
            <div className="profile-block-content-data-item-oval">
              <p className="profile-block-content-data-item-oval-text">{user.weight}</p>
            </div>
            <p className="profile-block-content-data-item-text">Вес</p>
          </div>
          <div className="profile-block-content-data-item">
            <div className="profile-block-content-data-item-oval">
              <p className="profile-block-content-data-item-oval-text">
                {Math.round(user.weight / ((user.height / 100) * (user.height / 100)))}
              </p>
            </div>
            <p className="profile-block-content-data-item-text">Индекс массы тела</p>
          </div>
        </div>
        <div className="profile-block-content-item">
          <p className="profile-block-content-item-title">Фамилия имя:</p>
          <p className="profile-block-content-item-text">{`${user.lastName} ${user.firstName}`}</p>
        </div>
        <div className="profile-block-content-item">
          <p className="profile-block-content-item-title">Электронная почта:</p>
          <p className="profile-block-content-item-text">{user.email}</p>
        </div>
        <div className="profile-block-content-item">
          <p className="profile-block-content-item-title">Пароль:</p>
          <p className="profile-block-content-item-text">********</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileBlock;