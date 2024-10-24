import React, { useState, useEffect } from 'react';
import { ButtonActivity, ButtonEnter } from "../Buttons";
import { useNavigate, useParams } from 'react-router-dom';
import photoPost from '../../assets/icons/photoPost.svg';
import photoVerification from '../../assets/icons/photoVerification.svg';
import axios from 'axios';

import {link} from '../../consts.js';

const Activity = ({ setPage, isFeedPage }) => {
  const { id } = useParams();
  const [selectedSide, setSelectedSide] = useState('week');
  const [activities, setActivities] = useState([]);
  const [formState, setFormState] = useState("");
  const [activityTypes, setActivityTypes] = useState([]); 
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

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        let response;
        if (selectedSide === 'week') {
          response = await axios.get(`${link}/user/${id}/activities/week`);
        } else if (selectedSide === 'month') {
          response = await axios.get(`${link}/user/${id}/activities/month`);
        } else {
          response = await axios.get(`${link}/user/${id}/activities/all`);
        }
        setActivities(response.data.activities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();
  }, [selectedSide]);

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

  {/*const handleActivityImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      axios.post(`${link}/uploads`, formData)
      .then(response => {
        setActivityImage(response.data.imageUrl);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
    }
  };*/}

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
        console.log(uploadedUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const uploadFile = async (file) => {
    const presignedFields = await getImgKeys();
    const formData = new FormData();
    formData.append('key', `users/uploads/activity/${file.name}`);
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
      return `https://storage.yandexcloud.net/team2go/users/uploads/activity/${file.name}`;
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

  const handleActivityTypeChange = (type) => {
    setActivityType(type);
  };

  const handleSaveActivity = (event) => {
    event.preventDefault();
    function calculateTimeDifference(startTime, endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
    
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
    
      const differenceInMinutes = endTotalMinutes - startTotalMinutes;
      const hours = Math.floor(differenceInMinutes / 60);
      const minutes = differenceInMinutes % 60;
    
      return `${hours}:${minutes}`;
    }
    const time = calculateTimeDifference(activityStartTime, activityEndTime);
    
    const activityData = {
      type: activityType,
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

  // const getTotalTime = () => {
  //   return activities.reduce((total, activity) => total + activity.time, 0);
  // };

  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatMinutesToHours = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes}`;
  };

  const getTotalTime = () => {
    // return activities.reduce((total, activity) => total + activity.time, 0);
    const totalMinutes = activities.reduce((total, activity) => total + parseTimeToMinutes(activity.time), 0);
    return formatMinutesToHours(totalMinutes);
  };

  const getPeriodText = () => {
    switch (selectedSide) {
      case 'week':
        return 'за неделю';
      case 'month':
        return 'за месяц';
      case 'week && month':
        return 'за все время';
      default:
        return '';
    }
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
          <div className="activity-total">Всего: {getTotalTime()} часов активности {getPeriodText()}</div>

          <div className="activity-list">
            {activities.map((activity, index) => (
              <div key={index} className="activity-list-item">
                <div key={activity.type} id={activity.tag} className={`activity-tags ${activity.tag}-M`}>
                {/* <div key={activity.type} id={activity.tag} className={`activity-tags ${activity.tag} size-M`}> */}

                {/* <div key={activity.type} id={activity.tag} className={`activity-tags ${activity.tag}-${activity.size}`}> */}
                  {activity.type.toUpperCase()}
                </div>
                <div className={`activity-list-item-time ${activity.tag}`}>{activity.time} часов</div>
                <div className="activity-list-item-average">В среднем {activity.average} минуты в день</div>
              </div>
            ))}
          </div>
          </>
        ) : (
          <>
          <form onSubmit={handleSaveActivity}>
            <div className="activity-return">
              <button className="activity-return__prev" onClick={handleFormChange}>
                &lt;
              </button>
              <div>Добавление активности</div>
            </div>
            <div className="activity-input">
              <div className="activity-input-title">
              <div className="activity-input-title-number">1</div>
              Выберите вид активности</div>
              <div className="activity-input-content">

                {activityTypes.map(activity => (
                  <div key={activity.type} id={activity.tag} className={`activity-btn ${
                      activityType === activity.tag ? `${activity.tag}-bold` : `${activity.tag}-light`
                    }`}
                    onClick={() => handleActivityTypeChange(activity.tag)}
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
          </>
        )}
    </div>
  );
};

export default Activity;
