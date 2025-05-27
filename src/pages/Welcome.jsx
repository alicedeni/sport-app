import React, { useEffect } from 'react'
import WelcomeBlock from '../components/WelcomeBlock'
import FullWidthText from '../components/FullWidthText'

const Welcome = () => {
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
      <WelcomeBlock />
      <FullWidthText text={welcomeText} className="bottom" />
    </div>
  )
}

export default Welcome
