import React from 'react'
import WelcomeBlock from '../components/WelcomeBlock'
import FullWidthText from '../components/FullWidthText'

const Welcome = () => {
  const welcomeText =
    'СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ'

  return (
    <div className="welcome">
      <FullWidthText text={welcomeText} className="top" />
      <WelcomeBlock />
      <FullWidthText text={welcomeText} className="bottom" />
    </div>
  )
}

export default Welcome
