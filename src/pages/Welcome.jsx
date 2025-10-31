import React from 'react'
import WelcomeBlock from '@components/WelcomeBlock.jsx'
import FullWidthText from '@components/FullWidthText.jsx'
import { useAppHeight } from '@shared/hooks'

const Welcome = () => {
  useAppHeight()
  
  const welcomeText =
    'СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ'

  return (
    <div className="welcome">
      <FullWidthText text={welcomeText} className="top" />
      <WelcomeBlock />
      <FullWidthText text={welcomeText} className="bottom" />
    </div>
  )
}

export default Welcome
