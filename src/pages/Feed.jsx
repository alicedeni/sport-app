import React, { useState, useEffect, useRef } from 'react'
import Header from '../components/main/Header'
import MobileHeader from '@components/mobile/MobileHeader'
import MobileFooter from '@components/mobile/MobileFooter'
import Posts from '../components/main/Posts'
import axios from 'axios'

import { link } from '../consts.js'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820)
  const isMounted = useRef(true) // флаг монтирования

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
    isMounted.current = true

    getPostData()
      .then((data) => {
        if (isMounted.current && data && data.posts) {
          setPosts(data.posts)
        }
      })
      .catch((error) => {
        if (isMounted.current) {
          console.error(error)
        }
      })

    const handleResize = () => {
      if (isMounted.current) {
        setIsMobile(window.innerWidth <= 820)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      isMounted.current = false
      window.removeEventListener('resize', handleResize)
    }
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
