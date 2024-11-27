import React, { useState, useEffect } from 'react'
import Header from '../components/main/Header'
import MobileHeader from '../components/main/MobileHeader'
import Preview from '../components/main/Preview'

const PreviewPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="container" id="root">
      {isMobile ? <MobileHeader /> : <Header currentPage="view" />}
      <div className="main">
        <Preview />
      </div>
    </div>
  )
}

export default PreviewPage
