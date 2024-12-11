import React, { useState } from 'react'
import { ButtonEnter } from '../Buttons'

const MobileGoalBlock = () => {
  const [currentPage, setCurrentPage] = useState(0)

  const handlePrevPage = () => {
    setCurrentPage(currentPage === 0 ? 4 : currentPage - 1)
  }

  const handleNextPage = () => {
    setCurrentPage((currentPage + 1) % 5)
  }

  const handleGoToMain = () => {
    window.location.href = '/main'
  }

  const pages = [
    {
      title: 'SPORT APP: «ВЫЗОВ ПЕРВЫХ»',
      text:
        'Это тестовое командное состязание в честь запуска нашего приложения.\n' +
        'Цель состязания — собрать активностей на 402 км, что равнозначно достижению высоты орбиты МКС.',
      imageUrl: 'https://storage.yandexcloud.net/team2go/users/base/cat1.svg',
      imagePosition: { top: '150px', right: '0' },
    },
    {
      title: 'БАЛЛЫ',
      text:
        'Ходьба, бег, плавание, велоспорт, лыжи — каждый километр ваших тренировок принесёт вам баллы (🔥), которые пойдут в общий зачёт.\n' +
        'Баллы (🔥) — это внутренняя валюта челленджа. Все активности, которые вы добавляете, пересчитываются в баллы.',
      imageUrl: 'https://storage.yandexcloud.net/team2go/users/base/cat2.svg',
      imagePosition: { top: '220px', right: '30px' },
    },
    {
      title: 'ПРИЗЫ',
      text:
        'Активный образ жизни — уже награда. Команду победителей ждут специальные призы. Топ-3 лидера состязания в персональном зачёте также получат специальный приз.\n' +
        'Следите за достижениями коллег, получайте отчеты о собственной активности и приведите команду на первую позицию. \n' +
        'Вперед к достижениям! ❤',
      imageUrl: 'https://storage.yandexcloud.net/team2go/users/base/cat3.svg',
      imagePosition: { top: '-220px', right: '0px' },
    },
    {
      title: 'ЗАДАЧИ',
      text: 'Задачи на период орбитального челленджа «Вызов первых»:',
      imageUrl: '',
      imagePosition: {},
    },
    {
      title: 'СРОКИ',
      text: 'Старт мероприятия: ДД.ММ\n' + 'Подведение итогов: ДД.ММ',
      imageUrl: 'https://storage.yandexcloud.net/team2go/users/base/cat5.svg',
      buttonText: 'Поехали!',
      imagePosition: { top: '140px', right: '70px' },
    },
  ]

  return (
    <div className="mobile-goal-block">
      <div className="mobile-goal-block__header">
        <p className="mobile-goal-block__subtitle">СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ</p>
        <h1 className="mobile-goal-block__title">{pages[currentPage].title}</h1>
      </div>
      <div className="mobile-goal-block__body">
        <p className="mobile-goal-block__text">{pages[currentPage].text}</p>
        {pages[currentPage].imageUrl && (
          <img
            className="mobile-goal__image"
            src={pages[currentPage].imageUrl}
            alt={`cat ${currentPage + 1}`}
            style={{ position: 'absolute', ...pages[currentPage].imagePosition }}
          />
        )}
        <div>
          {currentPage === 4 && (
            <ButtonEnter
              className="welcome-block__btn"
              text="Поехали!"
              textContent={'Поехали!'}
              onClick={handleGoToMain}
            ></ButtonEnter>
          )}
          <div className="mobile-goal-block__arrow">
            <button
              className="mobile-goal-block__arrow-prev"
              onClick={handlePrevPage}
              style={{ visibility: currentPage === 0 ? 'hidden' : 'visible' }}
            >
              &lt;
            </button>
            <div className="mobile-goal-block__indicators">
              {pages.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${currentPage === index ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index)}
                ></span>
              ))}
            </div>
            <button
              className="mobile-goal-block__arrow-next"
              onClick={handleNextPage}
              style={{ visibility: currentPage === 4 ? 'hidden' : 'visible' }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileGoalBlock
