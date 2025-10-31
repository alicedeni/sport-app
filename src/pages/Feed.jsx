import React from 'react'
import FeedDesktop from '@pages/FeedDesktop.jsx'
import FeedMobile from '@pages/FeedMobile.jsx'
import { useResponsive } from '@shared/hooks'
import { UI_CONSTANTS } from '@constants'

const Feed = () => {
  const isMobile = useResponsive(UI_CONSTANTS.BREAKPOINTS.MOBILE)

  return isMobile ? <FeedMobile /> : <FeedDesktop />
}

export default Feed
