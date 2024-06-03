import React, { useState, useEffect } from 'react';
import { ButtonDelete, ButtonExit } from "./Buttons";
import axios from 'axios';

const ProfileBlock = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [editModeProfile, setEditModeProfile] = useState(false);
  const [editModeProgress, setEditModeProgress] = useState(false);
  const [editModeAccount, setEditModeAccount] = useState(false);

  const [tempUser, setTempUser] = useState(user);

  useEffect(() => {
    setTempUser(user);
  }, [user]);

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
    axios.post('http://localhost:5000/edit_person_data', tempUser)
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
    axios.post('http://localhost:5000/logout')
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
    axios.delete(`http://localhost:5000/delete_account`)
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
    if (bmi <= 16) return '#6699CC'; // Выраженный дефицит массы тела
    else if (bmi > 16 && bmi <= 18.5) return '#339966'; // Недостаточная масса тела (дефицит)
    else if (bmi > 18.5 && bmi <= 25) return '#33CC66'; // Норма
    else if (bmi > 25 && bmi <= 30) return '#00CC00'; // Избыточная масса тела (состояние, предшествующее ожирению)
    else if (bmi > 30 && bmi <= 35) return '#FF6600'; // Ожирение 1-й степени
    else if (bmi > 35 && bmi <= 40) return '#FF3300'; // Ожирение 2-й степени
    else return '#FF0000'; // Ожирение 3-й степени
  };

  if (!tempUser) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="profile-block">
      <img src={`http://localhost:5000/${tempUser.avatar}`} alt={`${tempUser.firstName} ${tempUser.lastName}`} className="profile-block-avatar" />
      <span className="profile-block-name">{`${tempUser.lastName} ${tempUser.firstName}`}</span>
      
      <div className="profile-block-content">
        <div className="profile-block-content-data">
          <div className="profile-block-content-data-title">
            <p className="profile-block-content-data-title-name">Мои данные</p> 
            <button onClick={handleEditClickProfile} className="profile-block-content-data-title-pen">
              <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z" stroke="#E0E0E0" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <div className="profile-block-content-data-line"/>
          <div className="profile-block-content-data-items">
            <div className="profile-block-content-data-item">
              <p className="profile-block-content-data-item-text">Рост</p>
              <div className="profile-block-content-data-item-oval">
                {editModeProfile ? (
                  <input className="profile-block-content-data-item-oval-input" type="number" value={tempUser.height} onChange={(event) => handleInputChange(event, 'height')} />
                ) : (
                  <p className="profile-block-content-data-item-oval-text">{tempUser.height} см</p>
                )}
              </div>
            </div>
            <div className="profile-block-content-data-item">
              <p className="profile-block-content-data-item-text">Вес</p>
              <div className="profile-block-content-data-item-oval">
                {editModeProfile ? (
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
              {editModeProfile && (
                <div className="profile-block-content-data-btn">
                  <button onClick={handleCancelClickProfile} className="profile-block-content-data-btn-cancel">Отменить</button>
                  <button onClick={handleSaveClickProfile} className="profile-block-content-data-btn-save">Сохранить</button>
                </div>
              )}
          </div>
        </div>
        

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
              <p className="profile-block-content-data-item-text">Сбросил вес</p>
              <div className="profile-block-content-data-item-oval">
                {editModeProgress ? (
                  <input className="profile-block-content-data-item-oval-input" type="number" value={tempUser.weightLoss} onChange={(event) => handleInputChange(event, 'weightLoss')} />
                ) : (
                  <p className="profile-block-content-data-item-oval-text">{tempUser.weightLoss} кг</p>
                )}
              </div>
            </div>
            <div className="profile-block-content-data-item">
              <p className="profile-block-content-data-item-text">Тренировок</p>
              <div className="profile-block-content-data-item-oval">
                {editModeProgress ? (
                  <input className="profile-block-content-data-item-oval-input" type="number" value={tempUser.trainings} onChange={(event) => handleInputChange(event, 'trainings')} />
                ) : (
                  <p className="profile-block-content-data-item-oval-text">{tempUser.trainings}</p>
                )}
              </div>
            </div>
            <div className="profile-block-content-data-item">
              <p className="profile-block-content-data-item-text">Потрачено калорий</p>
              <div className="profile-block-content-data-item-oval">
                {editModeProgress ? (
                  <input className="profile-block-content-data-item-oval-input" type="number" value={tempUser.caloriesBurned} onChange={(event) => handleInputChange(event, 'caloriesBurned')} />
                ) : (
                  <p className="profile-block-content-data-item-oval-text">{tempUser.caloriesBurned} ккал</p>
                )}
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
          <div className="profile-block-content-account-line"/>
          <div className="profile-block-content-account-items">
            <div className="profile-block-content-account-item">
              <p className="profile-block-content-account-item-text">Электронная почта</p>
              <div className="profile-block-content-account-item-oval">
                {editModeAccount ? (
                  <input className="profile-block-content-account-item-oval-input" type="email" value={tempUser.email} onChange={(event) => handleInputChange(event, 'email')} />
                ) : (
                  <p className="profile-block-content-account-item-oval-text">{tempUser.email}</p>
                )}
              </div>
            </div>
            <div className="profile-block-content-account-item">
              <p className="profile-block-content-account-item-text">Пароль</p>
              <div className="profile-block-content-account-item-oval">
                {editModeAccount ? (
                  <input className="profile-block-content-account-item-oval-input" type="password" value={tempUser.password} onChange={(event) => handleInputChange(event, 'password')} />
                ) : (
                  <p className="profile-block-content-account-item-oval-text">********</p>
                )}
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
