import React, { useEffect, useState } from 'react'
import GoalBlock from '@components/GoalBlock'
import MobileGoalBlock from '@components/mobile/MobileGoalBlock'

const GlobalGoal = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const setAppHeight = () => {
      const appHeight = window.innerHeight
      document.documentElement.style.setProperty('--app-height', `${appHeight}px`)
    }

    setAppHeight()
    window.addEventListener('resize', setAppHeight)

    return () => {
      window.removeEventListener('resize', setAppHeight)
    }
  }, [])

  return <div className="goal_page">{isMobile ? <MobileGoalBlock /> : <GoalBlock />}</div>
}

export default GlobalGoal
