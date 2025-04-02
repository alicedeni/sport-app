import React, { useState, useEffect } from 'react'
import Header from '../components/main/Header'
import MobileHeader from '@components/mobile/MobileHeader'
import Activity from '../components/main/Activity'
import MobileFooter from '@components/mobile/MobileFooter'

const ActivityPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="container" id="root">
      {isMobile ? <MobileHeader /> : <Header currentPage="activity" />}
      <div className="main">
        <Activity />
      </div>
      {isMobile && <MobileFooter />}
    </div>
  )
}

export default ActivityPage
