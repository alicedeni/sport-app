import React from 'react'

const Modal = ({ isOpen, onClose, title, children, size = 'medium', className = '' }) => {
  if (!isOpen) return null

  const sizesPx = {
    small: 480,
    medium: 640,
    large: 896,
    xlarge: 1152,
  }

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  }

  const containerStyle = {
    background: '#fff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: `${sizesPx[size] || sizesPx.medium}px`,
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  }

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #eee',
  }

  const bodyStyle = {
    padding: '16px 20px',
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={containerStyle} onClick={(e) => e.stopPropagation()} className={className}>
        {title && (
          <div style={headerStyle}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111827' }}>{title}</h3>
            <button
              onClick={onClose}
              style={{ border: 'none', background: 'transparent', color: '#6b7280', cursor: 'pointer' }}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        )}
        <div style={bodyStyle}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
