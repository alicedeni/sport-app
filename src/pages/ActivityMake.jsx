import React from 'react'
import Header from '@components/main/Header.jsx'
import MobileHeader from '@components/mobile/MobileHeader'
import MobileFooter from '@components/mobile/MobileFooter'
import ActivityMake from '@components/main/ActivityMake.jsx'
import { useResponsive } from '@shared/hooks'

const ActivityMakePage = () => {
  const isMobile = useResponsive()

  return (
    <div className="container" id="root">
      {isMobile ? <MobileHeader /> : <Header currentPage="activity" />}
      <div className="main">
        <ActivityMake />
      </div>
      {isMobile && <MobileFooter />}
    </div>
  )
}

export default ActivityMakePage
