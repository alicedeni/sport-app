import { useState, useEffect } from 'react'
import { userService } from '@shared/services/userService.js'
import logger from '@shared/utils/logger'

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
          const showWelcomeValue =
            mainData.show_welcome !== undefined
              ? mainData.show_welcome === true
              : profile.show_welcome === true

          setUserData({
            name: profile.name || profile.firstName || '',
            avatar: profile.avatar || '',
            points: profile.points || 0,
            goal: mainData.goal || profile.goal || 0,
            teams: mainData.teams || profile.teams || 0,
            participants: mainData.participants || profile.participants || 0,
            count: mainData.count || profile.count || 0,
            showWelcome: showWelcomeValue,
          })
        } else {
          logger.error('Error loading profile:', profileData.message)
          setError(new Error(profileData.message || 'Failed to load profile'))
        }
        setError(null)
      } catch (err) {
        setError(err)
        logger.error('Ошибка при загрузке данных пользователя:', err)
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
      const showWelcomeFromServer = data?.show_welcome === true
      setUserData((prev) => ({ ...prev, showWelcome: showWelcomeFromServer }))
    } catch (e) {
      setUserData((prev) => ({ ...prev, showWelcome: false }))
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
