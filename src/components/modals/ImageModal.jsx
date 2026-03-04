import React, { useState, useEffect } from 'react'

const ImageModal = ({ images, initialIndex = 0, imageUrl, onClose }) => {
  const imageArray = images && images.length > 0 ? images : (imageUrl ? [imageUrl] : [])
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const hasMultipleImages = imageArray.length > 1

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex, imageArray.length])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1))
  }

  if (imageArray.length === 0) return null

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          <img
            src="https://storage.yandexcloud.net/team2go/users/base/closeDefault.svg"
            className="close-img"
            alt="Close"
          />
        </span>
        
        {hasMultipleImages && (
          <>
            <button
              className="image-modal-nav image-modal-nav--prev"
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              aria-label="Предыдущее фото"
            >
              ‹
            </button>
            <button
              className="image-modal-nav image-modal-nav--next"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              aria-label="Следующее фото"
            >
              ›
            </button>
            <div className="image-modal-counter">
              {currentIndex + 1} / {imageArray.length}
            </div>
          </>
        )}
        
        <img src={imageArray[currentIndex]} alt={`Enlarged ${currentIndex + 1}`} className="image-modal-image" />
      </div>
    </div>
  )
}

export default ImageModal
