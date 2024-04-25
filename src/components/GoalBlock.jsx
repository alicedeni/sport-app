import React, { useState } from 'react';
import axios from 'axios';
import { ButtonEnter } from "./Buttons";

const GoalBlock = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrevPage = () => {
    setCurrentPage(currentPage === 0 ? 4 : currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((currentPage + 1) % 5);
  };

  const handleGoToMain = () => {
    
    window.location.href = '/main';
  };

  const pages = [
    { title: 'НАША ЦЕЛЬ', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus vitae nunc, cursus vitae eget nisl elementum et.' },
    { title: 'ЧЕЛЛЕНДЖИ', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus vitae nunc, cursus vitae eget nisl elementum et.' },
    { title: 'КОМАНДЫ', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus vitae nunc, cursus vitae eget nisl elementum et.' },
    { title: 'ЛИГИ', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus vitae nunc, cursus vitae eget nisl elementum et.' },
    { title: 'ПЕРВАЯ НЕДЕЛЯ', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus vitae nunc, cursus vitae eget nisl elementum et.', buttonText: 'Поехали!' },
  ];

  return (
    <div className="goal-block">
      <div className="goal-block__header">
        {currentPage !== 0 && (
          <button className="goal-block__prev" onClick={handlePrevPage}>
            &lt;
          </button>
        )}
        <h1 className="goal-block__title">{pages[currentPage].title}</h1>
        {currentPage !== 4 && (
          <button className="goal-block__next" onClick={handleNextPage}>
            &gt;
          </button>
        )}
      </div>
      <div className="goal-block__content">
        <p className="goal-block__text">{pages[currentPage].text}</p>
        {currentPage === 4 && <ButtonEnter className="welcome-block__btn" text="Поехали!" textContent={"Поехали!"} onClick={handleGoToMain}></ButtonEnter>}
      </div>
    </div>
  );
};

export default GoalBlock;