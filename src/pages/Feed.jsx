import React, { useState, useEffect } from 'react'
import FeedDesktop from './FeedDesktop'
import FeedMobile from './FeedMobile'

const Feed = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile ? <FeedMobile /> : <FeedDesktop />
}

export default Feed
