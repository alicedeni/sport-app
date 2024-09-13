import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ButtonDelete, ButtonExit } from "./Buttons";
import ProfileData from './profile/ProfileData';
import TeamAndLeague from './profile/TeamLeague';
import axios from 'axios';

import { link } from '../consts.js';

const ProfileBlock = ({ user }) => {
  const { id } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [editModeProfile, setEditModeProfile] = useState(false);
  const [editModeProgress, setEditModeProgress] = useState(false);
  const [editModeAccount, setEditModeAccount] = useState(false);
  const [activities, setActivities] = useState([
    {
      type: 'Бассейн',
      tag: 'pool',
      time: 16,
      calories: 2387,
    },
    {
      type: 'велотренировка',
      tag: 'bike',
      time: 4,
      calories: 2387
    },
    {
      type: 'Бассейн',
      tag: 'pool',
      time: 16,
      calories: 2387
    },
    {
      type: 'Бассейн',
      tag: 'pool',
      time: 16,
    },
  ]);

  const [tempUser, setTempUser] = useState(user);

  useEffect(() => {
    setTempUser(user);
  }, [user]);

  useEffect(() => {
    axios.get(`${link}/profile_activities`)
      .then(response => {
        if (response.data.status === 200) {
          setActivities(response.data.activities);
        } else {
          console.error('Error loading activities:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error loading activities:', error);
      });
  }, []);
  const handleEditClickProfile = () => {
    setEditModeProfile(true);
  };

  const handleEditClickProgress = () => {
    setEditModeProgress(true);
  };

  const handleEditClickAccount = () => {
    setEditModeAccount(true);
  };

  const handleCancelClickProfile = () => {
    setEditModeProfile(false);
    setTempUser(user);
  };

  const handleCancelClickProgress = () => {
    setEditModeProgress(false);
  };

  const handleCancelClickAccount = () => {
    setEditModeAccount(false);
    setTempUser(user);
  };
  const handleSave = () => {
    if (!tempUser) {
        console.error('Данные пользователя отсутствуют');
        return;
    }
    axios.post(`${link}/edit_person_data/${id}`, tempUser)
        .then(response => {
            if (response.data.status === 200) {
                setUser(tempUser);
                setEditModeProfile(false);
                console.log('Данные пользователя успешно отправлены на сервер');
            } else {
                console.error('Ошибка при отправке данных на сервер:', response.data.error);
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке данных на сервер:', error);
        });
  };

  const handleSaveClickProfile = () => {
    console.log('user', user);
    setEditModeProfile(false);
    setTempUser(user);
    handleSave();
  };

  const handleSaveClickProgress = () => {
    setEditModeProgress(false);
    setTempUser(user);
    handleSave();
  };

  const handleSaveClickAccount = () => {
    setEditModeAccount(false);
    setTempUser(user);
    handleSave();
  };
  const handleExit = () => {
    axios.post(`${link}/logout`)
    .then(response => {
      if (response.data.status === 200) {
        window.location.href = '/';
        console.log('Выход из аккаунта выполнен успешно');
      } else {
        console.error('Ошибка при выходе из аккаунта:', response.data.error);
      }
    })
    .catch(error => {
      console.error('Ошибка при выходе из аккаунта:', error);
    });
  };

  const handleDelete = () => {
    axios.delete(`${link}/delete_account/${id}`)
      .then(response => {
        if (response.data.status === 200) {
          window.location.href = '/';
          console.log('Аккаунт успешно удален');
        } else {
          console.error('Ошибка при удалении аккаунта:', response.data.error);
        }
      })
      .catch(error => {
        console.error('Ошибка при удалении аккаунта:', error);
      });
  };

  const handleInputChange = (event, field) => {
    setTempUser({ ...tempUser, [field]: event.target.value });
  };

  const getColorCode = (bmi) => {
    if (bmi <= 16) return '#6699CC'; 
    else if (bmi > 16 && bmi <= 18.5) return '#339966';
    else if (bmi > 18.5 && bmi <= 25) return '#33CC66'; 
    else if (bmi > 25 && bmi <= 30) return '#00CC00';
    else if (bmi > 30 && bmi <= 35) return '#FF6600';
    else if (bmi > 35 && bmi <= 40) return '#FF3300';
    else return '#FF0000'; 
  };

  if (!tempUser) {
    return <div>Loading...</div>;
  }

  const getLeagueColor = (league) => {
    switch (league) {
      case 'bronze':
        return 'rgba(255, 61, 117, 0.6)';
      case 'silver':
        return 'rgba(0, 120, 212, 0.6)'; 
      case 'gold':
        return 'rgba(255, 204, 56, 0.7)'; 
      default:
        return '#FFFFFF';
    }
  };
  const leagueColor = getLeagueColor(tempUser.league);

  return (
    <div className="profile-block">
      <img src={`${link}/${tempUser.avatar}`} alt={`${tempUser.firstName} ${tempUser.lastName}`} className="profile-block-avatar" />
      <span className="profile-block-name">{`${tempUser.lastName} ${tempUser.firstName}`}</span>
      
      <div className="profile-block-content">
        <TeamAndLeague tempUser={tempUser} leagueColor={leagueColor} />
        <ProfileData 
          tempUser={tempUser}
          editModeProfile={editModeProfile}
          handleInputChange={handleInputChange}
          handleCancelClickProfile={handleCancelClickProfile}
          handleSaveClickProfile={handleSaveClickProfile}
          handleEditClickProfile={handleEditClickProfile}
        />
        <div className="profile-block-content-data">
          <div className="profile-block-content-data-title">
            <p className="profile-block-content-data-title-name">Мой прогресс</p>
            <button onClick={handleEditClickProgress} className="profile-block-content-data-title-pen">
              <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" stroke="#E0E0E0" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <div className="profile-block-content-data-line"/>
          <div className="profile-block-content-data-item">
            <div className="profile-block__activity-list">
              {activities.map((activity, index) => (
                <div key={index} className={`profile-block__activity-list-item ${activity.tag}-metric`} style={{position: "relative"}}>
                  <div key={activity.type} id={activity.tag} className={`activity-tags ${activity.tag}-S`}>
                    {activity.type.toUpperCase()}
                  </div>
                  <div className={`profile-block__activity-list-item-time ${activity.tag}`}>{activity.time} часов</div>
                </div>
              ))}
            </div>
            <div className="profile-block-content-data-line"/>
            <div className="profile-block-content-data-item-row">
              <p className="profile-block-content-data-item-label">Моя цель:</p>
              <p className="profile-block-content-data-item-value">Улучшить форму</p>
            </div>
          </div>
          <div className="profile-block-content-data-btns">
            {editModeProgress ? (
              <div className="profile-block-content-data-btns">
                <button className="profile-block-content-data-btn profile-block-content-data-btn_cancel" onClick={handleCancelClickProgress}>
                  Отменить
                </button>
                <button className="profile-block-content-data-btn profile-block-content-data-btn_save" onClick={handleSaveClickProgress}>
                  Сохранить
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div className="profile-block-content-data">
          <div className="profile-block-content-data-title">
            <p className="profile-block-content-data-title-name">Мой аккаунт</p>
            <button onClick={handleEditClickAccount} className="profile-block-content-data-title-pen">
              <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" stroke="#E0E0E0" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <div className="profile-block-content-data-line"/>
          <div className="profile-block-content-data-profile">
            <div className="profile-block-content-data-item-column">
              <div className="profile-block-content-data-item-value">
                <img src={editMode ? tempUser.avatar : tempUser.avatar} alt={tempUser.name} className="profile-block-content-data-item-image" />
                {editModeAccount && (
                  <input type="file" onChange={(event) => handleInputChange(event, 'avatar')} />
                )}
              </div>
            </div>
            <div className="profile-block-content-data-profile-column">
              <div className="profile-block-content-data-profile-column-i">
              <p className="profile-block-content-data-item-text">Имя</p>
              <div className="profile-block-content-data-item-value">
                {editModeAccount ? (
                  <input className="profile-block-content-data-item-value" type="text" value={tempUser.firstName} onChange={(event) => handleInputChange(event, 'lastName')} />
                ) : (
                  <p>{tempUser.firstName}</p>
                )}
              </div>
              </div>
              <div className="profile-block-content-data-profile-column-i">
              <p className="profile-block-content-data-item-text">Фамилия</p>
              <div className="profile-block-content-data-item-value">
                {editModeAccount ? (
                  <input className="profile-block-content-data-item-value" type="text" value={tempUser.lastName} onChange={(event) => handleInputChange(event, 'lastName')} />
                ) : (
                  <p>{tempUser.lastName}</p>
                )}
              </div>
              </div>
            </div>
            <div className="profile-block-content-data-profile-column">
            <div className="profile-block-content-data-profile-column-i">
              <p className="profile-block-content-data-item-text">Электронная почта</p>
              <div className="profile-block-content-data-item-value">
                {editModeAccount ? (
                  <input className="profile-block-content-data-item-value" type="email" value={tempUser.email} onChange={(event) => handleInputChange(event, 'email')} />
                ) : (
                  <p>{tempUser.email}</p>
                )}
              </div>
              </div>
              <div className="profile-block-content-data-profile-column-i">
              <p className="profile-block-content-data-item-text">Пароль</p>
              <div className="profile-block-content-data-item-value">
                {editModeAccount ? (
                  <input className="profile-block-content-data-item-value" type="password" value={tempUser.password} onChange={(event) => handleInputChange(event, 'password')} />
                ) : (
                  <p>*******</p>
                )}
              </div>
              </div>
            </div>
          </div>
          <div className="profile-block-content-account-btns">
            {editModeAccount ? (
              <div className="profile-block-content-account-btns">
                <button className="profile-block-content-account-btn profile-block-content-account-btn_cancel" onClick={handleCancelClickAccount}>
                  Отменить
                </button>
                <button className="profile-block-content-account-btn profile-block-content-account-btn_save" onClick={handleSaveClickAccount}>
                  Сохранить
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="profile-block-btn">
        <ButtonExit text="Выйти из аккаунта" textContent={"Выйти из аккаунта"} onClick={handleExit}/>
        <ButtonDelete text="Удалить аккаунт" textContent={"Удалить аккаунт"}  onClick={handleDelete}/>
      </div>
    </div>
  );
};

export default ProfileBlock;