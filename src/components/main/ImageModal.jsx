import React from 'react'

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="image-modal-close" onClick={onClose}>
          &times;
        </span>
        <img src={imageUrl} alt="Enlarged" className="image-modal-image" />
      </div>
    </div>
  )
}

export default ImageModal
