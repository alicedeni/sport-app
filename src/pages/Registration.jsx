import React, { useEffect } from 'react'
import RegistrationBlock from '../components/RegistrationBlock'
import FullWidthText from '../components/FullWidthText'

const Registration = () => {
  const welcomeText =
    'СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ СПОРТИВНЫЙ ЧЕЛЛЕНДЖ ДИТ'

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

  return (
    <div className="welcome">
      <FullWidthText text={welcomeText} className="top" />
      <RegistrationBlock />
      <FullWidthText text={welcomeText} className="bottom" />
    </div>
  )
}

export default Registration
