import React from 'react'
import { TailSpin } from 'react-loader-spinner'

const LoadingSpinner = ({ 
  height = "80", 
  width = "80", 
  color = "white", 
  ariaLabel = "loading",
  fullScreen = false,
  className = ""
}) => {
  const containerStyle = fullScreen 
    ? { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }
    : {}

  return (
    <div style={containerStyle} className={className}>
      <TailSpin 
        height={height} 
        width={width} 
        color={color} 
        ariaLabel={ariaLabel} 
      />
    </div>
  )
}

export default LoadingSpinner

