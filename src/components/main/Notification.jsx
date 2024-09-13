import React from 'react';
import { ButtonProfile } from "../Buttons";
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const Notification = ({ isOpen, userName, onClose }) => {
  const { id } = useParams();
  if (!isOpen) {
    return null;
  }

  return (
    <div className="header-notification">
      <h1 className="header-notification-title">Привет, {userName}!</h1>
      <p className="header-notification-text">Рады видеть тебя в нашем спортивном челлендже. Наша глобальная цель — Lorem ipsum dolor sit amet.<br></br>Основное соревнование начнется со второй недели, а пока что ты можешь заполнить данные о себе и свои персональные цели в личном профиле.</p>
      <ButtonProfile className="welcome-block__btn" text="Личный профиль" textContent={"Личный профиль"}></ButtonProfile>
      <button className="header-notification-close" onClick={onClose}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="6.53552" width="5" height="42" rx="2.5" transform="rotate(-45 3 6.53552)" fill="#BDBDBD"/>
          <rect width="5" height="42" rx="2.5" transform="matrix(0.707107 0.707107 0.707107 -0.707107 3 33)" fill="#BDBDBD"/>
        </svg>
      </button>
    </div>
  );
};

export default Notification;