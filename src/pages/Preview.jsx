import React, { useState, useEffect } from 'react'
import Header from '../components/main/Header'
import MobileHeader from '@components/mobile/MobileHeader'
import Preview from '../components/main/Preview'
import MobileFooter from '@components/mobile/MobileFooter'

const PreviewPage = () => {
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
      {isMobile ? <MobileHeader /> : <Header currentPage="view" />}
      <div className="main">
        <Preview />
      </div>
      {isMobile && <MobileFooter />}
    </div>
  )
}

export default PreviewPage
