import React, { useState, useEffect } from 'react'
import Header from '../components/main/Header'
import MobileHeader from '@components/mobile/MobileHeader'
import Challenges from '../components/main/Challenges'
import MobileFooter from '@components/mobile/MobileFooter'

const ChallengesPage = () => {
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
      {isMobile ? <MobileHeader /> : <Header currentPage="challenges" />}
      <div className="main">
        <Challenges />
      </div>
      {isMobile && <MobileFooter />}
    </div>
  )
}

export default ChallengesPage
