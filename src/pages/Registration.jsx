import React from 'react'
import RegistrationBlock from '../components/RegistrationBlock'
import FullWidthText from '../components/FullWidthText'

const Registration = () => {
  const welcomeText =
    'СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ'

  return (
    <div className="welcome">
      <FullWidthText text={welcomeText} className="top" />
      <RegistrationBlock />
      <FullWidthText text={welcomeText} className="bottom" />
    </div>
  )
}

export default Registration
