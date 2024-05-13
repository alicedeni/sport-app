import React, { useState } from 'react';
import { ButtonDelete, ButtonExit } from "./Buttons";

const ProfileBlock = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setTempUser(user);
  };

  const handleSaveClick = () => {
    setEditMode(false);
    // API call to update the user data
  };

  const handleInputChange = (event, field) => {
    setTempUser({ ...tempUser, [field]: event.target.value });
  };

  const getColorCode = (bmi) => {
    if (bmi <= 16) return '#6699CC'; // Выраженный дефицит массы тела
    else if (bmi > 16 && bmi <= 18.5) return '#339966'; // Недостаточная масса тела (дефицит)
    else if (bmi > 18.5 && bmi <= 25) return '#33CC66'; // Норма
    else if (bmi > 25 && bmi <= 30) return '#00CC00'; // Избыточная масса тела (состояние, предшествующее ожирению)
    else if (bmi > 30 && bmi <= 35) return '#FF6600'; // Ожирение 1-й степени
    else if (bmi > 35 && bmi <= 40) return '#FF3300'; // Ожирение 2-й степени
    else return '#FF0000'; // Ожирение 3-й степени
  };

  return (
    <div className="profile-block">
      <img src={tempUser.avatar} alt={tempUser.name} className="profile-block-avatar" />
      <span className="profile-block-name">{`${tempUser.lastName} ${tempUser.firstName}`}</span>
      
      <div className="profile-block-content">
        <div className="profile-block-content-data">
          <div className="profile-block-content-data-title">
            <p className="profile-block-content-data-title-name">Мои данные</p> 
            <button onClick={handleEditClick} className="profile-block-content-data-title-pen">
              <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" stroke="#E0E0E0" stroke-width="2" />
              </svg>
            </button>
          </div>
          <div className="profile-block-content-data-line"/>
          <div className="profile-block-content-data-items">
            <div className="profile-block-content-data-item">
              <p className="profile-block-content-data-item-text">Рост</p>
              <div className="profile-block-content-data-item-oval">
                {editMode ? (
                  <input className="profile-block-content-data-item-oval-input" type="number" value={tempUser.height} onChange={(event) => handleInputChange(event, 'height')} />
                ) : (
                  <p className="profile-block-content-data-item-oval-text">{tempUser.height} см</p>
                )}
              </div>
            </div>
            <div className="profile-block-content-data-item">
              <p className="profile-block-content-data-item-text">Вес</p>
              <div className="profile-block-content-data-item-oval">
                {editMode ? (
                  <input className="profile-block-content-data-item-oval-input" type="number" value={tempUser.weight} onChange={(event) => handleInputChange(event, 'weight')} />
                ) : (
                  <p className="profile-block-content-data-item-oval-text">{tempUser.weight} кг</p>
                )}
              </div>
            </div>
            <div className="profile-block-content-data-item">
              <p className="profile-block-content-data-item-text">Индекс массы тела</p>
              <div className="profile-block-content-data-item-oval" style={{ backgroundColor: getColorCode((tempUser.weight / ((tempUser.height / 100) * (tempUser.height / 100))).toFixed(1)), border: 'none' }}>
                <p className="profile-block-content-data-item-oval-text" style={{ color: '#ffffff' }}>{(tempUser.weight / ((tempUser.height / 100) * (tempUser.height / 100))).toFixed(1)}</p>
              </div>
              <div style={{ color: getColorCode((tempUser.weight / ((tempUser.height / 100) * (tempUser.height / 100))).toFixed(1)), fontSize: '14px' }}>
                {(() => {
                  const bmi = (tempUser.weight / ((tempUser.height / 100) * (tempUser.height / 100))).toFixed(1);
                  if (bmi <= 16) return 'Выраженный дефицит массы тела';
                  else if (bmi > 16 && bmi <= 18.5) return 'Недостаточная масса тела';
                  else if (bmi > 18.5 && bmi <= 25) return 'Норма';
                  else if (bmi > 25 && bmi <= 30) return 'Избыточная масса тела';
                  else if (bmi > 30 && bmi <= 35) return 'Ожирение 1-й степени';
                  else if (bmi > 35 && bmi <= 40) return 'Ожирение 2-й степени';
                  else return 'Ожирение 3-й степени';
                })()}
              </div>
            </div>
          </div>
            {editMode && (
              <div className="profile-block-content-data-btn">
                <button onClick={handleCancelClick} className="profile-block-content-data-btn-cancel">Отменить</button>
                <button onClick={handleSaveClick} className="profile-block-content-data-btn-save">Сохранить</button>
              </div>
            )}
        </div>
        <div className="profile-block-content-data">
          <div className="profile-block-content-data-title">
            <p className="profile-block-content-data-title-name">Мой прогресс</p>
            <button onClick={handleEditClick} className="profile-block-content-data-title-pen">
              <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" stroke="#E0E0E0" stroke-width="2" />
              </svg>
            </button>
          </div>
          <div className="profile-block-content-data-line"/>
          <div className="profile-block-content-data-item">
            <div className="profile-block-content-data-item-row">
              <p className="profile-block-content-data-item-label">Бассейн:</p>
              <p className="profile-block-content-data-item-value">{tempUser.activity[0].time} часов</p>
            </div>
            <div className="profile-block-content-data-item-row">
              <p className="profile-block-content-data-item-label">Моя цель:</p>
              <p className="profile-block-content-data-item-value">Улучшить форму</p>
            </div>
          </div>
          {editMode && (
              <div className="profile-block-content-data-btn">
              <button onClick={handleCancelClick} className="profile-block-content-data-btn-cancel">Отменить</button>
                <button onClick={handleSaveClick} className="profile-block-content-data-btn-save">Сохранить</button>
              </div>
            )}
        </div>
        <div className="profile-block-content-data">
          <div className="profile-block-content-data-title">
            <p className="profile-block-content-data-title-name">Мой аккаунт</p>
            <button onClick={handleEditClick} className="profile-block-content-data-title-pen">
              <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" stroke="#E0E0E0" stroke-width="2" />
              </svg>
            </button>
          </div>
          <div className="profile-block-content-data-line"/>
          <div className="profile-block-content-data-item">
            <div className="profile-block-content-data-item-column">
              <div className="profile-block-content-data-item-value">
                <img src={editMode ? tempUser.avatar : tempUser.avatar} alt={tempUser.name} className="profile-block-content-data-item-image" />
                {editMode && (
                  <input type="file" onChange={(event) => handleInputChange(event, 'avatar')} />
                )}
              </div>
            </div>
            <div className="profile-block-content-data-item-column">
              <div>
              <p className="profile-block-content-data-item-text">Имя</p>
              <div className="profile-block-content-data-item-value">
                {editMode ? (
                  <input className="profile-block-content-data-item-value" type="text" value={tempUser.firstName} onChange={(event) => handleInputChange(event, 'lastName')} />
                ) : (
                  <p>{tempUser.firstName}</p>
                )}
              </div>
              </div>
              <div>
              <p className="profile-block-content-data-item-text">Фамилия</p>
              <div className="profile-block-content-data-item-value">
                {editMode ? (
                  <input className="profile-block-content-data-item-value" type="text" value={tempUser.lastName} onChange={(event) => handleInputChange(event, 'lastName')} />
                ) : (
                  <p>{tempUser.lastName}</p>
                )}
              </div>
              </div>
            </div>
            <div className="profile-block-content-data-item-column">
              <div>
              <p className="profile-block-content-data-item-text">Электронная почта</p>
              <div className="profile-block-content-data-item-value">
                {editMode ? (
                  <input className="profile-block-content-data-item-value" type="email" value={tempUser.email} onChange={(event) => handleInputChange(event, 'email')} />
                ) : (
                  <p>{tempUser.email}</p>
                )}
              </div>
              </div>
              <div>
              <p className="profile-block-content-data-item-text">Пароль</p>
              <div className="profile-block-content-data-item-value">
                {editMode ? (
                  <input className="profile-block-content-data-item-value" type="password" value={tempUser.password} onChange={(event) => handleInputChange(event, 'password')} />
                ) : (
                  <p>*******</p>
                )}
              </div>
              </div>
            </div>
          </div>
          {editMode && (
            <div className="profile-block-content-data-btn">
              <button onClick={handleCancelClick} className="profile-block-content-data-btn-cancel">Отменить</button>
              <button onClick={handleSaveClick} className="profile-block-content-data-btn-save">Сохранить</button>
            </div>
          )}
        </div>
      </div>
      <div className="profile-block-btn">
        <ButtonExit text="Выйти из аккаунта" textContent={"Выйти из аккаунта"}/>
        <ButtonDelete text="Удалить аккаунт" textContent={"Удалить аккаунт"}/>
      </div>
    </div>
  );
};

export default ProfileBlock;