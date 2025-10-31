import React from 'react'

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="error-modal-overlay">
      <div className="error-modal-content">
        <p>{message}</p>
        <button onClick={onClose}>ОК</button>
      </div>
    </div>
  )
}

export default ErrorModal
