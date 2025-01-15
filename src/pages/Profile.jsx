import React, { useState, useEffect } from 'react'
import ProfileBlock from '../components/ProfileBlock'
import axios from 'axios'
import Header from '../components/main/Header'
import MobileHeader from '@components/mobile/MobileHeader'
import { link } from '../consts.js'
import MobileFooter from '@components/mobile/MobileFooter'

const Profile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [user, setUser] = useState({})
  const [loadingUser, setLoadingUser] = useState(true)

  const getUserData = () => {
    const token = localStorage.getItem('token')
    return axios
      .get(`${link}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
      .finally(() => setLoadingUser(false))
  }

  useEffect(() => {
    getUserData()
      .then((data) => {
        if (data && data.profile) {
          setUser(data.profile)
        }
      })
      .catch((error) => console.error(error))

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (loadingUser) {
    return <div></div>
  }

  return (
    <div className="container">
      {isMobile ? <MobileHeader /> : <Header isFeedPage={false} />}
      <div className="main" style={{ marginTop: '100px' }}>
        <ProfileBlock user={user} setUser={setUser} />
      </div>
      {isMobile && <MobileFooter />}
    </div>
  )
}

export default Profile
