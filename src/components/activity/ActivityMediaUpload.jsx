import React from 'react'
import photoPost from '@assets/icons/photoPost.svg'

const ActivityMediaUpload = ({
  activityDescription,
  activityImage,
  onDescriptionChange,
  onImageChange
}) => {
  return (
    <div className="activity-input">
      <div className="activity-input-title">
        <div className="activity-input-title-number">3</div>
        Дополнительные данные
      </div>
      <div className="activity-input-content">
        <textarea
          className="activity-input-content-description"
          value={activityDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Здесь вы можете добавить комментарий к активности (до 500 символов)"
          maxLength={500}
        ></textarea>
        <div className="activity-input-content-image">
          {activityImage ? (
            <>
              <img src={activityImage} alt="Activity Image" />
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={onImageChange}
              />
            </>
          ) : (
            <>
              <img
                src={photoPost}
                alt="Add Photo Icon"
                style={{ marginBottom: '8px', width: '40px' }}
              />
              <label>Добавить фото активности</label>
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={onImageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityMediaUpload

