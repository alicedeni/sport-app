import React from 'react'

const ActivityTypePicker = ({ 
  activityTypes, 
  activityTag, 
  otherActivityTag, 
  isMobile, 
  onActivityTypeChange, 
  onOtherActivityTagChange 
}) => {
  return (
    <div className="activity-input">
      <div className="activity-input-title">
        <div className="activity-input-title-number">1</div>
        Выберите вид активности <span className="required-asterisk">*</span>
      </div>
      <div className="activity-input-content">
        {activityTypes.map((activity) => (
          <div
            key={activity.type}
            id={activity.tag}
            className={`activity-btn${isMobile ? `-mobile` : ``} ${
              activityTag === activity.tag ? `${activity.tag}-bold` : `${activity.tag}-light`
            }`}
            onClick={() => onActivityTypeChange(activity)}
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
              onChange={(e) => onOtherActivityTagChange(e.target.value)}
              placeholder="Название активности"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityTypePicker

