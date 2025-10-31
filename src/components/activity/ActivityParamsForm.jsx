import React from 'react'

const ActivityParamsForm = ({
  activityTag,
  activityStartDate,
  activityStartTime,
  activityDuration,
  activityStep,
  activityDistance,
  requiredFields,
  onInputChange,
  onValidateFields,
  onKeyPress
}) => {
  return (
    <div className="activity-input">
      <div className="activity-input-title">
        <div className="activity-input-title-number">2</div>
        Введите данные об активности <span className="required-asterisk">*</span>
      </div>
      <div className="activity-input-content flex-column">
        <div className="activity-input-content margin-left-0">
          <div className="activity-input-content-item">
            <label className="activity-input-content-item-name">Дата начала</label>
            <input
              className={`activity-input-content-item-field ${requiredFields.activityStartDate ? 'error' : ''}`}
              type="date"
              value={activityStartDate}
              onChange={(e) => onInputChange('activityStartDate', e.target.value)}
              onBlur={onValidateFields}
            />
          </div>
          <div className="activity-input-content-item">
            <label className="activity-input-content-item-name">Время начала (чч:мм)</label>
            <input
              className={`activity-input-content-item-field no-appearance ${requiredFields.activityStartTime ? 'error' : ''}`}
              type="time"
              value={activityStartTime}
              onChange={(e) => onInputChange('activityStartTime', e.target.value)}
              onBlur={onValidateFields}
            />
          </div>
          {['yoga', 'power', 'dance', 'game', 'other', 'cardio'].includes(activityTag) && (
            <div className="activity-input-content-item">
              <label className="activity-input-content-item-name">Длительность (чч:мм)</label>
              <input
                className={`activity-input-content-item-field no-appearance ${requiredFields.activityDuration ? 'error' : ''}`}
                type="time"
                value={activityDuration}
                onChange={(e) => onInputChange('activityDuration', e.target.value)}
                onBlur={onValidateFields}
              />
            </div>
          )}
          {['walk'].includes(activityTag) && (
            <div className="activity-input-content-item">
              <label className="activity-input-content-item-name">Шаги</label>
              <input
                className={`activity-input-content-item-field ${requiredFields.activityStep ? 'error' : ''}`}
                type="number"
                value={activityStep}
                onChange={(e) => onInputChange('activityStep', e.target.value)}
                onKeyPress={onKeyPress}
                min="1"
                onBlur={onValidateFields}
              />
            </div>
          )}
          {['pool', 'bike', 'run'].includes(activityTag) && (
            <div className="activity-input-content-item">
              <label className="activity-input-content-item-name">Дистанция</label>
              <input
                className={`activity-input-content-item-field ${requiredFields.activityDistance ? 'error' : ''}`}
                type="number"
                value={activityDistance}
                onChange={(e) => onInputChange('activityDistance', e.target.value)}
                onKeyPress={onKeyPress}
                min="0"
                step="0.01"
                onBlur={onValidateFields}
              />
              <label className="calories-label">{activityTag === 'pool' ? 'м' : 'км'}</label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityParamsForm

