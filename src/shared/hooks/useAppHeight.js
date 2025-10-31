import { useEffect } from 'react'

/**
 * Хук для установки CSS переменной --app-height
 * Автоматически обновляет высоту при изменении размера окна
 */
export const useAppHeight = () => {
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
}

