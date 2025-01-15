import React, { useState, useEffect } from 'react'
import Header from '../components/main/Header'
import MobileHeader from '@components/mobile/MobileHeader'
import MobileFooter from '@components/mobile/MobileFooter'
import Posts from '../components/main/Posts'
import axios from 'axios'

import { link } from '../consts.js'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const getPostData = () => {
    const token = localStorage.getItem('token')
    return axios
      .get(`${link}/user/posts`, {
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
    getPostData()
      .then((data) => {
        if (data && data.posts) {
          setPosts(data.posts)
        }
      })
      .catch((error) => console.error(error))

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="container" id="root">
      {isMobile ? <MobileHeader /> : <Header currentPage="feed" />}
      <div className="main">
        <Posts posts={posts} />
      </div>
      {isMobile && <MobileFooter />}
    </div>
  )
}

export default Feed
