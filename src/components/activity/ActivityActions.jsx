import React from 'react'

const ActivityActions = ({ onFormChange }) => {
  return (
    <div className="activity-return">
      <button className="activity-return__prev" onClick={onFormChange}>
        &lt;
      </button>
      <div>Добавление активности</div>
    </div>
  )
}

export default ActivityActions
