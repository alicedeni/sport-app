import React, { useState, useEffect } from 'react'
import Header from '../components/main/Header'
import MobileHeader from '@components/mobile/MobileHeader'
import Ratings from '../components/main/Ratings'
import MobileFooter from '@components/mobile/MobileFooter'

const RatingsPage = () => {
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
      {isMobile ? <MobileHeader /> : <Header currentPage="ratings" />}
      <div className="main">
        <Ratings />
      </div>
      {isMobile && <MobileFooter />}
    </div>
  )
}

export default RatingsPage
