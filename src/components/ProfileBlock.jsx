import React from 'react';

const ProfileBlock = ({ user }) => {
  return (
    <div className="profile-block">
      <h1 className="profile-block-title">Профиль</h1>
      <hr style={{ width: "100%", color: "$white", backgroundColor: "$white", height: "1px" }} />
      <div className="profile-block-content">
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