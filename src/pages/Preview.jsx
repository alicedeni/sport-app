import React from 'react'
import Header from '@components/main/Header.jsx'
import MobileHeader from '@components/mobile/MobileHeader'
import Preview from '@components/main/Preview.jsx'
import MobileFooter from '@components/mobile/MobileFooter'
import { useResponsive } from '@shared/hooks'

const PreviewPage = () => {
  const isMobile = useResponsive()

  return (
    <div className="container" id="root">
      {isMobile ? <MobileHeader /> : <Header currentPage="view" />}
      <div className="main">
        <Preview />
      </div>
      {isMobile && <MobileFooter />}
    </div>
  )
}

export default PreviewPage
