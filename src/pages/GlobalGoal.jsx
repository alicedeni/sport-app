import React from 'react'
import GoalBlock from '@components/GoalBlock'
import MobileGoalBlock from '@components/mobile/MobileGoalBlock'
import { useResponsive, useAppHeight } from '@shared/hooks'

const GlobalGoal = () => {
  const isMobile = useResponsive()
  useAppHeight()

  return <div className="goal_page">{isMobile ? <MobileGoalBlock /> : <GoalBlock />}</div>
}

export default GlobalGoal
