import React from 'react'
import RegistrationBlock from '@components/RegistrationBlock.jsx'
import FullWidthText from '@components/FullWidthText.jsx'
import { useAppHeight } from '@shared/hooks'

const Registration = () => {
  useAppHeight()
  
  const welcomeText =
    'СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ'

  return (
    <div className="welcome">
      <FullWidthText text={welcomeText} className="top" />
      <RegistrationBlock />
      <FullWidthText text={welcomeText} className="bottom" />
    </div>
  )
}

export default Registration
