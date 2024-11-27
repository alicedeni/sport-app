import React, { useState, useEffect } from 'react'
import Header from '../components/main/Header'
import MobileHeader from '../components/main/MobileHeader'
import ActivityMake from '../components/main/ActivityMake'
import axios from 'axios'

import { link } from '../consts.js'

const ActivityMakePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [user, setUser] = useState({
    id: 1,
    last_name: 'Иванов',
    first_name: 'Иван',
    email: 'test@gmail.com',
    height: 170,
    weight: 70,
    target_weight: 10,
    activity: [{ type: 'pool', color: 'blue', time: 16, calories: 8500 }],
    team: 'Команда №1',
    teammates: 8,
    league: 'gold',
    place_league: 6,
    avatar:
      'https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2345549599.jpg',
  })

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
  }

  useEffect(() => {
    getUserData()
      .then((data) => {
        if (data && data.profile) {
          setUser(data.profile)
        }
      })
      .catch((error) => console.error(error))
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="container" id="root">
      {isMobile ? <MobileHeader /> : <Header currentPage="activity" />}
      <div className="main">
        <ActivityMake />
      </div>
    </div>
  )
}

export default ActivityMakePage
