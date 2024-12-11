import React, { useEffect, useState } from 'react'
import GoalBlock from '@components/GoalBlock'
import MobileGoalBlock from '@components/mobile/MobileGoalBlock'

const GlobalGoal = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return <div className="goal">{isMobile ? <MobileGoalBlock /> : <GoalBlock />}</div>
}

export default GlobalGoal
