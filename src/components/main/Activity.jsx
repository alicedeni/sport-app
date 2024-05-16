import React, { useState } from 'react';
import { ButtonActivity, ButtonEnter } from "../Buttons";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Activity = () => {
  const [selectedSide, setSelectedSide] = useState('week');
  const [formState, setFormState] = useState("");
  const [activityType, setActivityType] = useState("");
  const [activityStartTime, setActivityStartTime] = useState("");
  const [activityEndTime, setActivityEndTime] = useState("");
  const [activityDistance, setActivityDistance] = useState("");
  const [activityCalories, setActivityCalories] = useState("");
  const [activityVerification, setActivityVerification] = useState(null);
  const [activityImage, setActivityImage] = useState(null);
  const [activityDescription, setActivityDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleClick = (side) => {
    setSelectedSide(side);
  };

  const handleFormChange = () => {
    if (formState === "") {
      setFormState("add");
    } else {
      setFormState("");
    }
  };

  const handleActivityStartTimeChange = (time) => {
    setActivityStartTime(time);
  };

  const handleActivityEndTimeChange = (time) => {
    setActivityEndTime(time);
  };

  const handleActivityDistanceChange = (distance) => {
    setActivityDistance(distance);
  };

  const handleActivityCaloriesChange = (calories) => {
    setActivityCalories(calories);
  };

  const handleActivityImageChange = (image) => {
    const imageUrl = URL.createObjectURL(image);
    setActivityImage(imageUrl);
  };

  const handleActivityVerificationChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
  
      axios.post('http://localhost:5000/uploads', formData)
      .then(response => {
        setActivityVerification(response.data.imageUrl);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
    }
  };
  

  const handleActivityDescriptionChange = (description) => {
    setActivityDescription(description);
  };

  const handleActivityTypeChange = (type) => {
    setActivityType(type);
    const allActivityTypes = ['pool', 'cardio', 'run', 'power', 'bike', 'game', 'dance', 'other'];
    allActivityTypes.forEach(activity => {
      if (activity !== type) {
        document.getElementById(activity).style.display = 'none';
      }
    });
  };

  const handleSaveActivity = (event) => {
    event.preventDefault();
    const activityData = {
      type: activityType,
      startTime: activityStartTime,
      endTime: activityEndTime,
      distance: activityDistance,
      calories: activityCalories,
      verification: activityVerification,
      image: activityImage,
      description: activityDescription,
    };
  
    navigate('/editting', { state: { activityData } });
  };

  const isFormAdd = formState === "";

  return (
    <div className="activity">
        {isFormAdd ? (
          <>
          <ButtonActivity className="welcome-block__btn" text="Добавить активность" textContent={"Добавить активность"} onClick={handleFormChange}></ButtonActivity>
          <div className="select_time">
            <div className="select_time-variant" style={{backgroundColor: selectedSide === 'week' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('week')}>За неделю</div>
            <div className="select_time-variant" style={{backgroundColor: selectedSide === 'month' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('month')}>За месяц</div>
            <div className="select_time-variant" style={{backgroundColor: selectedSide === 'week && month' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('week && month')}>За все время</div>
          </div>
          </>
        ) : (
          <>
          <form onSubmit={handleSaveActivity}>
            <div className="activity-return">
              <button className="activity-return__prev" onClick={handleFormChange}>
                &lt;
              </button>
              Добавление активности
            </div>
            <div className="activity-input">
              <div className="activity-input-title">
              <div className="activity-input-title-number">1</div>
              Выберите вид активности</div>
              <div className="activity-input-content">
                <div id="pool" className={`activity-btn ${
                    activityType === 'pool' ? 'pool-bold' : 'pool-light'
                  }`}
                  onClick={() => handleActivityTypeChange('pool')}
                >
                  БАССЕЙН
                </div>
                <div id="cardio" className={`activity-btn ${
                    activityType === 'cardio' ? 'cardio-bold' : 'cardio-light'
                  }`}
                  onClick={() => handleActivityTypeChange('cardio')}
                >
                  КАРДИОТРЕНИРОВКА
                </div>
                <div id="run" className={`activity-btn ${
                    activityType === 'run' ? 'run-bold' : 'run-light'
                  }`}
                  onClick={() => handleActivityTypeChange('run')}
                >
                  БЕГ
                </div>
                <div id="power" className={`activity-btn ${
                    activityType === 'power' ? 'power-bold' : 'power-light'
                  }`}
                  onClick={() => handleActivityTypeChange('power')}
                >
                  СИЛОВАЯ ТРЕНИРОВКА
                </div>
                <div id="bike" className={`activity-btn ${
                    activityType === 'bike' ? 'bike-bold' : 'bike-light'
                  }`}
                  onClick={() => handleActivityTypeChange('bike')}
                >
                  ВЕЛОТРЕНИРОВКА
                </div>
                <div id="game" className={`activity-btn ${
                    activityType === 'game' ? 'game-bold' : 'game-light'
                  }`}
                  onClick={() => handleActivityTypeChange('game')}
                >
                  СПОРТИВНЫЕ ИГРЫ
                </div>
                <div id="dance" className={`activity-btn ${
                    activityType === 'dance' ? 'dance-bold' : 'dance-light'
                  }`}
                  onClick={() => handleActivityTypeChange('dance')}
                >
                  ТАНЦЫ
                </div>
                <div id="other" className={`activity-btn ${
                    activityType === 'other' ? 'other-bold' : 'other-light'
                  }`}
                  onClick={() => handleActivityTypeChange('other')}
                >
                  ДРУГОЕ
                </div>
              </div>
            </div>
            <div className="activity-input">
                <div className="activity-input-title">
                <div className="activity-input-title-number">2</div>
                Введите данные об активности</div>
              <div className="activity-input-content">
                <div className="activity-input-content-item">
                  <label className="activity-input-content-item-name">Время начала</label>
                  <input
                    className="activity-input-content-item-field"
                    type="time"
                    value={activityStartTime}
                    onChange={(e) => handleActivityStartTimeChange(e.target.value)}
                  />
                </div>
                <div className="activity-input-content-item">
                  <label className="activity-input-content-item-name">Время окончания</label>
                  <input
                    className="activity-input-content-item-field"
                    type="time"
                    value={activityEndTime}
                    onChange={(e) => handleActivityEndTimeChange(e.target.value)}
                  />
                </div>
                {['pool', 'run', 'bike'].includes(activityType) && (
                  <div className="activity-input-content-item">
                    <label className="activity-input-content-item-name">Расстояние</label>
                    <input
                      className="activity-input-content-item-field"
                      type="number"
                      value={activityDistance}
                      onChange={(e) => handleActivityDistanceChange(e.target.value)}
                    />
                  </div>
                )}
                <div className="activity-input-content-item">
                  <label className="activity-input-content-item-name">Калории</label>
                  <input
                    className="activity-input-content-item-field"
                    type="number"
                    value={activityCalories}
                    onChange={(e) => handleActivityCaloriesChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="activity-input">
              <div className="activity-input-title">
                <div className="activity-input-title-number">3</div>
                Подтверждение</div>
                <div className="activity-input-content">
                  <div className="activity-input-content-verification">
                    <label>Загрузить изображение</label>
                    <input
                      type="file" accept=".jpg, .jpeg, .png" 
                      onChange={handleActivityVerificationChange} // Нет e.target.files[0]
                    />
                  </div>
                  {activityVerification && (
                    <>
                        {console.log(activityVerification)}
                        <img src={`http://localhost:5000${activityVerification}`} alt="Activity Verification" />
                        {/* <img src={activityVerification} alt="Activity Verification" /> */}
                    </>
                  )}
                </div>
            </div>
            <div className="activity-input">
                <div className="activity-input-title">
                    <div className="activity-input-title-number">4</div>
                    Дополнительные данные
                </div>
                <div className="activity-input-content">
                    <textarea
                        className="activity-input-content-description"
                        value={activityDescription}
                        onChange={(e) => handleActivityDescriptionChange(e.target.value)}
                    ></textarea>
                    <div className="activity-input-content-image">
                        <label>Добавить фото активности</label>
                        <input
                            type="file" accept=".jpg, .jpeg, .png"
                            onChange={(e) => handleActivityImageChange(e.target.files[0])}
                        />
                    </div>
                </div>
            </div>
            <ButtonEnter className="welcome-block__btn" text="Отправить" type="submit" textContent={"Отправить"}></ButtonEnter>
          </form>
          </>
        )}
    </div>
  );
};

export default Activity;