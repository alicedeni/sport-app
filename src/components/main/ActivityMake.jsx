import React, { useState, useEffect } from 'react';
import { ButtonActivity, ButtonEnter } from "../Buttons";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import photoPost from '../../assets/icons/photoPost.svg';
import photoVerification from '../../assets/icons/photoVerification.svg';
import axios from 'axios';

import {link} from '../../consts.js';

const ActivityMake = () => {
  const { id } = useParams();
  const location = useLocation();
  const { activityData } = location.state || {};
  const [activityTypes, setActivityTypes] = useState([]); 
  const [activityType, setActivityType] = useState("");
  const [activityTag, setActivityTag] = useState("");
  const [activityStartTime, setActivityStartTime] = useState("");
  const [activityEndTime, setActivityEndTime] = useState("");
  const [activityDistance, setActivityDistance] = useState("");
  const [activityCalories, setActivityCalories] = useState("");
  const [activityVerification, setActivityVerification] = useState(null);
  const [activityImage, setActivityImage] = useState(null);
  const [activityDescription, setActivityDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (activityData) {
      setActivityType(activityData.tag);
      setActivityTag(activityData.type);
      setActivityStartTime(activityData.startTime);
      setActivityEndTime(activityData.endTime);
      setActivityDistance(activityData.distance);
      setActivityCalories(activityData.calories);
      setActivityVerification(activityData.verification);
      setActivityImage(activityData.image);
      setActivityDescription(activityData.description);
    }

    axios.get(`${link}/user/${id}/list_of_activities`)
      .then(response => {
        if (response.data.status === 200) {
          setActivityTypes(response.data.activities);
        } else {
          console.error('Error loading activities:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error loading activities:', error);
      });
  }, [activityData]);

  const handleFormChange = () => {
    navigate(`/activity/${id}`, { state: { page: "activity" } });
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

  const getImgKeys = async () => {
    try {
      const response = await axios.get(`${link}/img_keys`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleActivityImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const uploadedUrl = await uploadFile(file);
        setActivityImage(uploadedUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const uploadFile = async (file) => {
    const presignedFields = await getImgKeys();

    const userId = id;
    const timestamp = Date.now(); 
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}_${timestamp}.${fileExtension}`;

    const formData = new FormData();
    formData.append('key', `users/uploads/activity/${fileName}`);
    formData.append('X-Amz-Credential', presignedFields["fields"]["x-amz-credential"]);
    formData.append('acl', 'public-read');
    formData.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
    formData.append('X-Amz-Date', presignedFields["fields"]["x-amz-date"]);
    formData.append('policy', presignedFields["fields"]["policy"]);
    formData.append('X-Amz-Signature', presignedFields["fields"]["x-amz-signature"]);
    formData.append('file', file);

    try {
      await axios.post('https://storage.yandexcloud.net/team2go', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return `https://storage.yandexcloud.net/team2go/users/uploads/activity/${fileName}`;
    } catch (error) {
      throw new Error('File upload failed');
    }
  };


  const handleActivityVerificationChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const uploadedUrl = await uploadFile(file);
        setActivityVerification(uploadedUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleActivityDescriptionChange = (description) => {
    setActivityDescription(description);
  };

  const handleActivityTypeChange = (activity) => {
    setActivityType(activity.type);
    setActivityTag(activity.tag);
  };

  const handleKeyPress = (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleSaveActivity = (event) => {
    event.preventDefault();

    if (!activityTag || !activityStartTime || !activityEndTime) {
        alert("Пожалуйста, заполните все обязательные поля: тип активности, время начала/окончания.");
        return;
      }

    function calculateTimeDifference(startTime, endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
    
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
    
      const differenceInMinutes = endTotalMinutes - startTotalMinutes;
      let hours = Math.floor(differenceInMinutes / 60);
      let minutes = differenceInMinutes % 60;
      if (differenceInMinutes < 0 && differenceInMinutes > -60) {
        hours = 0;
      } 
    
      return `${hours}:${minutes}`;
    }
    const time = calculateTimeDifference(activityStartTime, activityEndTime);
    
    const activityData = {
      type: activityTag,
      tag: activityType,
      time: time,
      startTime: activityStartTime,
      endTime: activityEndTime,
      distance: activityDistance,
      calories: activityCalories,
      verification: activityVerification,
      image: activityImage,
      description: activityDescription,
    };

  
    navigate(`/preview/${id}`, { state: { activityData, page: "view" } });
  };

  return (
    <div className="activity">
        <form onSubmit={handleSaveActivity}>
            <div className="activity-return">
                <button className="activity-return__prev" onClick={handleFormChange}>
                &lt;
                </button>
                <div>Добавление активности</div>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="activity-input">
                <div className="activity-input-title">
                <div className="activity-input-title-number">1</div>
                Выберите вид активности</div>
                <div className="activity-input-content">

                {activityTypes.map(activity => (
                    <div key={activity.type} id={activity.tag} className={`activity-btn ${
                        activityTag === activity.tag ? `${activity.tag}-bold` : `${activity.tag}-light`
                    }`}
                    onClick={() => handleActivityTypeChange(activity)}
                    >
                    {activity.type.toUpperCase()}
                    </div>
                ))}
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
                        onKeyPress={handleKeyPress}
                        min="1"
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
                    onKeyPress={handleKeyPress}
                    min="1"
                    />
                    <label className="calories-label">ккал</label>
                </div>
                </div>
            </div>
            <div className="activity-input">
                <div className="activity-input-title">
                <div className="activity-input-title-number">3</div>
                Подтверждение (данное фото не будет доступно для пользователей)</div>
                <div className="activity-input-content">
                    <div className="activity-input-content-verification">
                    {activityVerification ? (
                        <>
                            <img src={activityVerification} alt="Activity Verification" />
                        </>
                    ) : (
                        <>
                            <img src={photoVerification} alt="Add Verification Photo Icon" style={{ marginBottom: '8px', width: '50px' }} />
                            <label>Загрузить изображение</label>
                            <input
                                type="file" accept=".jpg, .jpeg, .png" 
                                onChange={handleActivityVerificationChange} 
                            />
                        </>
                        )}
                    </div>
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
                        placeholder='Здесь вы можете добавить комментарий к активности'
                    ></textarea>
                    <div className="activity-input-content-image">
                        {activityImage ? (
                            <>
                                <img src={activityImage} alt="Activity Image" />
                            </>
                        ) : (
                            <>
                                <img src={photoPost} alt="Add Photo Icon" style={{ marginBottom: '8px', width: '40px' }} />
                                <label>Добавить фото активности</label>
                                <input
                                    type="file" accept=".jpg, .jpeg, .png"
                                    onChange={handleActivityImageChange}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="activity-submit_btn">
            <ButtonEnter className="welcome-block__btn" text="Далее" type="submit" textContent={"Далее"}></ButtonEnter>
            </div>
        </form>
    </div>
  );
};

export default ActivityMake;
