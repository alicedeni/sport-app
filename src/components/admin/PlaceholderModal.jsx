/**
 * Заглушка для недоделанного функционала
 * Используется для модальных окон, которые будут реализованы в будущем
 */

import React from 'react'

const PlaceholderModal = ({ title, onClose, featureName }) => {
  return (
    <div className="admin-modal">
      <div className="admin-modal__content">
        <div className="admin-modal__header">
          <h3>{title}</h3>
          <button className="admin-modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="admin-modal__body">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '18px', marginBottom: '20px', color: '#666' }}>
              Функция "{featureName}" находится в разработке
            </p>
            <p style={{ color: '#999' }}>
              Данный функционал будет доступен в будущих обновлениях
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceholderModal

