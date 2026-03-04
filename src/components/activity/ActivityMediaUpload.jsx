import React from 'react'
import photoPost from '@assets/icons/photoPost.svg'

const ActivityMediaUpload = ({
  activityDescription,
  activityImages = [],
  onDescriptionChange,
  onImagesChange,
  onRemoveImage,
  uploadError = '',
  isUploading = false
}) => {
  const MAX_IMAGES = 10
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
        <div className={`activity-input-content-image ${activityImages.length > 0 ? 'has-images' : ''}`}>
          {activityImages.length > 0 && activityImages.length < MAX_IMAGES && (
            <div className="activity-add-photo-button">
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                multiple
                onChange={onImagesChange}
                id="add-photo-input"
                className="activity-add-photo-input"
              />
              <label htmlFor="add-photo-input" className="activity-add-photo-label">
                <span className="activity-add-photo-plus">+</span>
              </label>
            </div>
          )}
          
          {activityImages.length > 0 && (
            <div className="activity-images-preview-scrollable">
              <div className="activity-images-preview">
                {activityImages.map((imageUrl, index) => (
                  <div key={index} className="activity-image-preview-item">
                    <img src={imageUrl} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="activity-image-remove-btn"
                      aria-label="Удалить фото"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activityImages.length === 0 && (
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
                multiple
                onChange={onImagesChange}
                disabled={isUploading}
              />
              {isUploading && (
                <div className="activity-upload-loading">
                  <span className="activity-upload-spinner">⟳</span>
                  <span>Загрузка...</span>
                </div>
              )}
            </>
          )}

          {activityImages.length >= MAX_IMAGES && (
            <div className="activity-images-limit">
              Достигнут лимит в {MAX_IMAGES} фотографий
            </div>
          )}

          {uploadError && (
            <div className="activity-upload-error">{uploadError}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityMediaUpload

