import React, { useState, useEffect } from 'react'
import Header from '../components/main/Header'
import MobileHeader from '../components/main/MobileHeader'
import ActivityMake from '../components/main/ActivityMake'

const ActivityMakePage = () => {
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
      {isMobile ? <MobileHeader /> : <Header currentPage="activity" />}
      <div className="main">
        <ActivityMake />
      </div>
    </div>
  )
}

export default ActivityMakePage
