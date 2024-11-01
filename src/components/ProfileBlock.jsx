import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ButtonDelete, ButtonExit } from "./Buttons";
import ProfileData from './profile/ProfileData';
import TeamAndLeague from './profile/TeamLeague';
import AccountSection from './profile/AccountSection';
import axios from 'axios';

import { link } from '../consts.js';

const ProfileBlock = ({ user }) => {
  const { id } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [editModeProfile, setEditModeProfile] = useState(false);
  const [editModeProgress, setEditModeProgress] = useState(false);
  const [editModeAccount, setEditModeAccount] = useState(false);
  const [weightGoal, setWeightGoal] = useState('lose');
  const [currentWeight, setCurrentWeight] = useState('');
  const [progressData, setProgressData] = useState(60); 
  const [activities, setActivities] = useState([/*
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
  */]);

  const [tempUser, setTempUser] = useState(user);
  const handleProgress = () => {
    axios.get(`${link}/user/${id}/progress`)
      .then(response => {
        if (response.data.status === 200) {
          setProgressData(response.data.progress);
        } else {
          console.error('Error loading progress:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error loading progress:', error);
      });
  };

  useEffect(() => {
    setTempUser(user);
  }, [user]);

  useEffect(() => {
    axios.get(`${link}/user/${id}/activities/all`)
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
    
    axios.get(`${link}/user/${id}/progress`)
      .then(response => {
        if (response.data.status === 200) {
          setProgressData(response.data.progress);
        } else {
          console.error('Error loading progress:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error loading progress:', error);
      });
  }, [id]);

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
  const handleUpdateUser = (updatedUser) => {
    setTempUser(updatedUser);
    setUser(updatedUser);
  };

  const handleSave = () => {
    if (!tempUser) {
        console.error('Данные пользователя отсутствуют');
        return;
    }
    axios.post(`${link}/edit_person_data/${id}`, tempUser)
        .then(response => {
            if (response.data.status === 200) {
                setTempUser(prevUser => ({
                  ...prevUser,
                  ...tempUser
                }));
                setEditModeProfile(false);
                handleProgress();
                console.log('1');
            } else {
                console.error('Ошибка при отправке данных на сервер:', response.data.error);
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке данных на сервер:', error);
        });
  };

  const handleSaveGoal = () => {
    if (!tempUser) {
        console.error('Данные пользователя отсутствуют');
        return;
    }
    axios.post(`${link}/user/${id}/set_goal`, tempUser)
        .then(response => {
            if (response.data.status === 200) {
                setTempUser(prevUser => ({
                  ...prevUser,
                  ...tempUser
                }));
                setEditModeProgress(false);
                handleProgress();
                console.log('2');
            } else {
                console.error('Ошибка при отправке данных на сервер:', response.data.error);
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке данных на сервер:', error);
        });
  };

  const handleSaveInfo = () => {
    if (!tempUser) {
        console.error('Данные пользователя отсутствуют');
        return;
    }
    axios.post(`${link}/edit_fio_data/${id}`, tempUser)
        .then(response => {
            if (response.data.status === 200) {
                setTempUser(prevUser => ({
                  ...prevUser,
                  ...tempUser
                }));
                setEditModeProgress(false);
                console.log('3');
            } else {
                console.error('Ошибка при отправке данных на сервер:', response.data.error);
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке данных на сервер:', error);
        });
  };


  const handleSaveClickProfile = () => {
    setEditModeProfile(false);
    setTempUser(user);
    handleSave();
  };

  const handleSaveClickProgress = () => {
    setEditModeProgress(false);
    setTempUser(user);
    handleSaveGoal();
  };

  const handleSaveClickAccount = () => {
    setEditModeAccount(false);
    setTempUser(user);
    handleSaveInfo();
  };
  const handleExit = () => {
    axios.post(`${link}/logout`)
    .then(response => {
      if (response.data.status === 200) {
        window.location.href = `main/${id}`;
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
          window.location.href = `main/${id}`;
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
    setTempUser(prevState => ({
        ...prevState,
        [field]: event.target.value
    }));
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
        return '#ed96ad';
      case 'silver':
        return '#91aee1'; 
      case 'gold':
        return '#f5dc8b'; 
      default:
        return '#FFFFFF';
    }
  };
  const leagueColor = getLeagueColor(tempUser.league);

  const handleKeyPress = (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className="profile-block">
      <img 
        src={tempUser.avatar ? tempUser.avatar : "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2345549599.jpg"} 
        alt={`${tempUser.firstName} ${tempUser.lastName}`} 
        className="profile-block-avatar" 
      />
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
          </div>
          <div className="profile-block-content-data-line"/>
          <div className="profile-block-content-data-item">
            <div className="profile-block__activity-list">
              {activities.map((activity, index) => (
                <div key={index} className={`profile-block__activity-list-item ${activity.tag}-metric`} style={{position: "relative"}}>
                  <div key={activity.type} id={activity.tag} className={`activity-tags ${activity.tag}-S`} style={{width: '100%'}}>
                    {activity.type.toUpperCase()}
                  </div>
                  <div className={`profile-block__activity-list-item-time ${activity.tag}`}>{activity.time} часов</div>
                </div>
              ))}
            </div>
            {/* <div className="profile-block-content-data-line"/> */}
          </div>
        </div>
        <div className="profile-block-content-data">
          <div className="profile-block-content-data-title">
            <p className="profile-block-content-data-title-name">Желаемый вес</p>
            
            {editModeProgress ? (
              <>
              <button onClick={handleEditClickProgress} className="profile-block-content-data-title-pen">
              <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" fill="url(#paint0_linear_580_1299)" stroke="url(#paint1_linear_580_1299)" stroke-width="2"/>
              <defs>
              <linearGradient id="paint0_linear_580_1299" x1="-3.00024" y1="19.5061" x2="3.7211" y2="25.7123" gradientUnits="userSpaceOnUse">
              <stop stop-color="#9D9DE6"/>
              <stop offset="0.427083" stop-color="#567FE3"/>
              <stop offset="0.885417" stop-color="#9664C8"/>
              </linearGradient>
              <linearGradient id="paint1_linear_580_1299" x1="-3.00024" y1="19.5061" x2="3.7211" y2="25.7123" gradientUnits="userSpaceOnUse">
              <stop stop-color="#9D9DE6"/>
              <stop offset="0.427083" stop-color="#567FE3"/>
              <stop offset="0.885417" stop-color="#9664C8"/>
              </linearGradient>
              </defs>
              </svg>
              </button>
              </>
            ):(
              <>
              <button onClick={handleEditClickProgress} className="profile-block-content-data-title-pen">
                <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" stroke="#E0E0E0" strokeWidth="2" />
                </svg>
              </button>
              </>
            )}
          </div>
          <div className="profile-block-content-data-items">
            <div className="profile-block-content-data-item-oval">
              {editModeProgress ? (
                <input 
                className="profile-block-content-data-item-oval-input" 
                type="number" 
                value={tempUser.target_weight} 
                onKeyPress={handleKeyPress}
                min="1" 
                onChange={(event) => handleInputChange(event, 'target_weight')} />
              ) : (
                <p className="profile-block-content-data-item-oval-text">{tempUser.target_weight}</p>
              )}
              <label className="profile-label">кг</label>
            </div>
          </div>
          <div className="progress-bar" style={{marginTop: '20px'}}>
            <div 
              className="progress" 
              style={{ width: `${progressData}%` }}
            ></div>
          </div>
          
          {editModeProgress && (
            <div className="profile-block-content-data-btn">
              <button onClick={handleCancelClickProgress} className="profile-block-content-data-btn-cancel">Отменить</button>
              <button onClick={handleSaveClickProgress} className="profile-block-content-data-btn-save">Сохранить</button>
            </div>
          )}
        </div>
        <AccountSection 
                tempUser={tempUser}
                editModeAccount={editModeAccount}
                handleInputChange={handleInputChange}
                handleCancelClickAccount={handleCancelClickAccount}
                handleSaveClickAccount={handleSaveClickAccount}
                handleEditClickAccount={handleEditClickAccount}
                handleUpdateUser={handleUpdateUser}
            />
      </div>
      <div className="profile-block-btn" style={{display: 'none'}}>
        <ButtonExit text="Выйти из аккаунта" textContent={"Выйти из аккаунта"} onClick={handleExit}/>
        <ButtonDelete text="Удалить аккаунт" textContent={"Удалить аккаунт"}  onClick={handleDelete}/>
      </div>
    </div>
  );
};

export default ProfileBlock;