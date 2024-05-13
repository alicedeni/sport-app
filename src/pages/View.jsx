import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ButtonEnter } from "../components/Buttons";
import Header from '../components/main/Header';
import axios from 'axios';

const EditingPage = () => {
  const { state } = useLocation();
  const { activityData } = state;
  const navigate = useNavigate();

  const handlePublish = () => {
    axios.post('http://localhost:5000/activities', activityData)
      .then(response => {
        if (response.data.status === 200) {
          console.log('Активность успешно опубликована');
          navigate('/main');
        } else {
          console.error('Ошибка при публикации активности:', response.data.error);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="preview-window">
      <div className="preview-window__content">
        <div className="preview-window__image-container">
          <img className="preview-window__image" src={activityData.image} alt="Activity Image" />
        </div>
        <div className="preview-window__info">
          <div>
            <div className="preview-window__time">{activityData.endTime} - {activityData.startTime} мин</div>
            <div className="preview-window__calories">{activityData.calories} ккал</div>
          </div>
          <div className="preview-window__text">{activityData.description}</div>
        </div>
      </div>
      <div>
          <ButtonEnter
            className="welcome-block__btn"
            text="Опубликовать"
            type="submit"
            textContent={"Опубликовать"}
            onClick={handlePublish}
          />
          <ButtonEnter
            className="welcome-block__btn"
            text="Назад"
            type="submit"
            textContent={"Назад"}
            onClick={handleBack}
          />
        </div>
    </div>
  );
};

export default EditingPage;