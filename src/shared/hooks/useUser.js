import { useState, useEffect } from 'react'
import { userService } from '@shared/services/userService.js'

export const useUser = () => {
  const [userData, setUserData] = useState({
    name: '',
    avatar: '',
    points: 0,
    goal: 0,
    teams: 0,
    participants: 0,
    count: 0,
    showWelcome: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        const [profileResponse, mainResponse] = await Promise.all([
          userService.getMainInfo(),
          userService.getMainData(),
        ])

        const profileData = profileResponse.data
        const mainData = mainResponse.data

        if (profileData.status === 200 && profileData.profile) {
          const profile = profileData.profile
          const welcomeHidden = localStorage.getItem('welcomeHidden') === 'true'

          setUserData({
            name: profile.name || profile.firstName || '',
            avatar: profile.avatar || '',
            points: profile.points || 0,
            goal: mainData.goal || profile.goal || 0,
            teams: mainData.teams || profile.teams || 0,
            participants: mainData.participants || profile.participants || 0,
            count: mainData.count || profile.count || 0,
            showWelcome: welcomeHidden ? false : profile.show_welcome !== false,
          })
        } else {
          console.error('Error loading profile:', profileData.message)
          setError(new Error(profileData.message || 'Failed to load profile'))
        }
        setError(null)
      } catch (err) {
        setError(err)
        console.error('Ошибка при загрузке данных пользователя:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const hideWelcome = async () => {
    try {
      const res = await userService.hideWelcome()
      const data = res?.data
      const showWelcomeFromServer =
        typeof data?.show_welcome === 'boolean' ? data.show_welcome : false
      setUserData((prev) => ({ ...prev, showWelcome: showWelcomeFromServer }))
      localStorage.setItem('welcomeHidden', showWelcomeFromServer ? 'false' : 'true')
    } catch (e) {
      setUserData((prev) => ({ ...prev, showWelcome: false }))
      localStorage.setItem('welcomeHidden', 'true')
    }
  }

  const updateUserData = (newUserData) => {
    setUserData((prev) => ({ ...prev, ...newUserData }))
  }

  return {
    userData,
    loading,
    error,
    hideWelcome,
    updateUserData,
  }
}
