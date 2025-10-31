import React from 'react'
import Header from '@components/main/Header.jsx'
import MobileHeader from '@components/mobile/MobileHeader'
import Ratings from '@components/main/Ratings.jsx'
import MobileFooter from '@components/mobile/MobileFooter'
import { useResponsive } from '@shared/hooks'

const RatingsPage = () => {
  const isMobile = useResponsive()

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
