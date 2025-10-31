import React from 'react'
import Header from '@components/main/Header'
import MobileHeader from '@components/mobile/MobileHeader'
import Activity from '@components/main/Activity'
import MobileFooter from '@components/mobile/MobileFooter'
import { useResponsive } from '@shared/hooks'

const ActivityPage = () => {
  const isMobile = useResponsive()

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
