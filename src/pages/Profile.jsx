import React, { useState, useEffect } from 'react'
import ProfileBlock from '@components/ProfileBlock.jsx'
import Header from '@components/main/Header.jsx'
import MobileHeader from '@components/mobile/MobileHeader'
import MobileFooter from '@components/mobile/MobileFooter'
import { useResponsive, useAppHeight, useUser } from '@shared/hooks'
import { createApiHandler, handleApiError } from '@shared/utils'
import api from '@shared/services/api'
import logger from '@shared/utils/logger'

const Profile = () => {
  const isMobile = useResponsive()
  useAppHeight()
  const { updateUserData } = useUser()

  const [user, setUser] = useState({})
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    api
      .get('/profile')
      .then(
        createApiHandler(
          (data) => {
            if (data && data.profile) {
              setUser(data.profile)
              updateUserData({
                name: data.profile.name || data.profile.firstName || '',
                avatar: data.profile.avatar || '',
              })
            }
            setLoadingUser(false)
          },
          (error) => {
            logger.error('Error loading profile:', error)
            setLoadingUser(false)
          },
        ),
      )
      .catch((error) => {
        handleApiError(error)
        setLoadingUser(false)
      })
  }, [])

  if (loadingUser) {
    return <div></div>
  }

  return (
    <div className="container">
      {isMobile ? <MobileHeader /> : <Header isFeedPage={false} />}
      <div className="main profile-main-margin">
        <ProfileBlock user={user} setUser={setUser} />
      </div>
      {isMobile && <MobileFooter />}
    </div>
  )
}

export default Profile
