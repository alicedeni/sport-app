import React, { useState, useEffect } from 'react';
import { ButtonActivity, ButtonEnter } from "../Buttons";
import { useNavigate, useLocation } from 'react-router-dom';
import photoPost from '../../assets/icons/photoPost.svg';
import photoVerification from '../../assets/icons/photoVerification.svg';
import axios from 'axios';

import {link} from '../../consts.js';

const ActivityMake = () => {
  const location = useLocation();
  const { activityData } = location.state || {};
  const [activityTypes, setActivityTypes] = useState([]); 
  const [activityType, setActivityType] = useState("");
  const [activityTag, setActivityTag] = useState("");
  const [otherActivityTag, setOtherActivityTag] = useState(""); 
  const [activityStartDate, setActivityStartDate] = useState();
  const [activityEndDate, setActivityEndDate] = useState(""); 
  const [activityStep, setActivityStep] = useState(""); 
  const [activityStartTime, setActivityStartTime] = useState("");
  const [activityEndTime, setActivityEndTime] = useState("");
  const [activityDuration, setActivityDuration] = useState("");
  const [activityDistance, setActivityDistance] = useState("");
  const [activityCalories, setActivityCalories] = useState("");
  const [activityVerification, setActivityVerification] = useState(null);
  const [activityImage, setActivityImage] = useState(null);
  const [activityDescription, setActivityDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const formatDateToInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {

    const today = new Date();
    setActivityStartDate(formatDateToInput(today));
    setActivityEndDate(formatDateToInput(today));


    if (activityData) {
      setActivityType(activityData.tag);
      setActivityTag(activityData.type);
      setActivityStartDate(activityData.startDate);
      setActivityEndDate(activityData.endDate); 
      setActivityStep(activityData.step);
      setActivityStartTime(activityData.startTime);
      setActivityEndTime(activityData.endTime);
      setActivityDistance(activityData.distance);
      setActivityCalories(activityData.calories);
      setActivityVerification(activityData.verification);
      setActivityImage(activityData.image);
      setActivityDescription(activityData.description);
      setOtherActivityTag(activityData.other);
    }
    const token = localStorage.getItem('token');
    axios.get(`${link}/user/list_of_activities`, {
      headers: { Authorization: `Bearer ${token}` }
    })
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
    navigate(`/activity`, { state: { page: "activity" } });
  };

  const handleActivityStartTimeChange = (time) => {
    setActivityStartTime(time);
  };

  const handleActivityDurationChange = (time) => {
    setActivityDuration(time);
  };

  const handleActivityStepChange = (step) => {
    setActivityStep(step);
  };

  const handleActivityDistanceChange = (step) => {
    setActivityDistance(step);
  };


  const handleActivityCaloriesChange = (calories) => {
    setActivityCalories(calories);
  };

  const getImgKeys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${link}/img_keys`, {
        headers : { Authorization: `Bearer ${token}` }
      });
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
    const token = localStorage.getItem('token');
    const userId = token;
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
    if (activity.tag !== 'other') {
      setOtherActivityTag(''); 
    }
  };

  const handleKeyPress = (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleSaveActivity = (event) => {
    event.preventDefault();

    if (!activityTag || !activityStartDate || !activityStartTime || !activityDuration) {
        alert("Пожалуйста, заполните все обязательные поля: тип активности, дата и время начала/окончания.");
        return;
    }
    const finalTag = otherActivityTag ? otherActivityTag : activityType;

    const startDateTime = new Date(`${activityStartDate}T${activityStartTime}`);
    const endDateTime = new Date(`${activityEndDate}T${activityEndTime}`);
    const now = new Date();

    if (startDateTime > now) {
      alert("Дата и время начала не могут быть в будущем.");
      return;
    }

    const activityData = {
      type: activityTag,
      tag: finalTag,
      time: activityDuration,
      startDate: activityStartDate,
      endDate: activityEndDate,
      step: activityStep,
      startTime: activityStartTime,
      endTime: activityEndTime,
      duration: activityDuration,
      distance: activityDistance,
      calories: activityCalories,
      verification: activityVerification,
      image: activityImage,
      description: activityDescription,
      other: otherActivityTag,
    };

    navigate(`/preview`, { state: { activityData, page: "view" } });
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

                {activityTag === 'other' && (
                  <div className="activity-input-content-item">
                      <input
                          className="activity-input-content-item-field-other"
                          type="text"
                          value={otherActivityTag}
                          onChange={(e) => setOtherActivityTag(e.target.value)}
                          placeholder="Название активности"
                      />
                  </div>
                )}
                </div>
            </div>
            <div className="activity-input">
                <div className="activity-input-title">
                <div className="activity-input-title-number">2</div>
                Введите данные об активности</div>
                <div className="activity-input-content" style={{flexDirection: 'colunmn'}}>
                  <div className="activity-input-content" style={{marginLeft: '0px'}}>
                    <div className="activity-input-content-item">
                        <label className="activity-input-content-item-name">Дата начала</label>
                        <input
                        className="activity-input-content-item-field"
                        type="date"
                        value={activityStartDate}
                        onChange={(e) => setActivityStartDate(e.target.value)}
                        />
                    </div>
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
                        <label className="activity-input-content-item-name">Длительность</label>
                        <input
                        className="activity-input-content-item-field"
                        type="time"
                        value={activityDuration}
                        onChange={(e) => handleActivityDurationChange(e.target.value)}
                        />
                    </div>
                    {['run', 'walk'].includes(activityTag) && (
                      <div className="activity-input-content-item">
                      <label className="activity-input-content-item-name">Шаги</label>
                      <input
                          className="activity-input-content-item-field"
                          type="number"
                          value={activityStep}
                          onChange={(e) => handleActivityStepChange(e.target.value)}
                          onKeyPress={handleKeyPress}
                          min="1"
                      />
                      </div>
                    )}
                    {['pool', 'bike', 'run', 'walk'].includes(activityTag) && (
                      <div className="activity-input-content-item">
                      <label className="activity-input-content-item-name">Дистанция</label>
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
                            <input
                                type="file" accept=".jpg, .jpeg, .png" 
                                onChange={handleActivityVerificationChange} 
                            />
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
                        placeholder='Здесь вы можете добавить комментарий к активности (до 500 символов)'
                        maxLength={500}
                    ></textarea>
                    <div className="activity-input-content-image">
                        {activityImage ? (
                            <>
                                <img src={activityImage} alt="Activity Image" />
                                <input
                                    type="file" accept=".jpg, .jpeg, .png"
                                    onChange={handleActivityImageChange}
                                />
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
