import React, { useState } from 'react';
import { ButtonActivity } from "../Buttons";

const Activity = () => {
  const [selectedSide, setSelectedSide] = useState('week');

  const handleClick = (side) => {
    setSelectedSide(side);
  };

  return (
    <div className="activity">
        <ButtonActivity className="welcome-block__btn" text="Добавить активность" textContent={"Добавить активность"}></ButtonActivity>
        <div className="select_time">
          <div className="select_time-variant" style={{backgroundColor: selectedSide === 'week' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('week')}>За неделю</div>
          <div className="select_time-variant" style={{backgroundColor: selectedSide === 'month' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('month')}>За месяц</div>
          <div className="select_time-variant" style={{backgroundColor: selectedSide === 'week && month' ? 'rgba(81, 184, 255, 0.2)' : 'white'}} onClick={() => handleClick('week && month')}>За все время</div>
        </div>
    </div>
  );
};

export default Activity;