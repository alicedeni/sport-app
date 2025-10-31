import React from 'react'
import Header from '@components/main/Header.jsx'
import MobileHeader from '@components/mobile/MobileHeader'
import Challenges from '@components/main/Challenges.jsx'
import MobileFooter from '@components/mobile/MobileFooter'
import { useResponsive } from '@shared/hooks'

const ChallengesPage = () => {
  const isMobile = useResponsive()

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
