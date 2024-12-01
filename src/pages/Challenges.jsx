import React, { useState, useEffect } from 'react'
import Header from '../components/main/Header'
import MobileHeader from '../components/main/MobileHeader'
import Challenges from '../components/main/Challenges'

const ChallengesPage = () => {
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
      {isMobile ? <MobileHeader /> : <Header currentPage="challenges" />}
      <div className="main">
        <Challenges />
      </div>
    </div>
  )
}

export default ChallengesPage
