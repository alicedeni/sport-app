import React from 'react'
import { ButtonProfile } from '@components/Buttons.jsx'

const WarningModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          <img
            src="https://storage.yandexcloud.net/team2go/users/base/closeDefault.svg"
            className="close-img"
            alt="Close"
          />
        </span>
        <div className="modal-content__activity">
          <img
            src="https://storage.yandexcloud.net/team2go/users/base/warn_cat.svg"
            alt="Icon"
            className="warning-icon"
          />
          <h3 className="modal-content__activity-title">
            Для начала работы с приложением просим заполнить личные данные в профиле{' '}
          </h3>
          <p>
            Это поможет нам корректно рассчитывать результаты и начислять баллы за активность, а вам
            — отслеживать свой прогресс.
          </p>
          <ButtonProfile text="Заполнить профиль" textContent={'Заполнить профиль'}></ButtonProfile>
        </div>
      </div>
    </div>
  )
}

export default WarningModal
