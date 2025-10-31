import React from 'react'

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          <img
            src="https://storage.yandexcloud.net/team2go/users/base/closeDefault.svg"
            className="close-img"
          />
        </span>
        <img src={imageUrl} alt="Enlarged" className="image-modal-image" />
      </div>
    </div>
  )
}

export default ImageModal
