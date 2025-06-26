import React, { useState, useEffect, useRef, useCallback } from 'react'
import throttle from 'lodash.throttle'
import Header from '../components/main/Header'
import MobileHeader from '@components/mobile/MobileHeader'
import FixedHeader from '@components/mobile/FixedHeader'
import MobileFooter from '@components/mobile/MobileFooter'
import Posts from '../components/main/Posts'
import axios from 'axios'

import { link } from '../consts.js'

const LIMIT = 20

const FeedMobile = () => {
  const [posts, setPosts] = useState([])
  const isMounted = useRef(true)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const mainRef = useRef(null)
  const offsetRef = useRef(offset)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820)

  useEffect(() => {
    offsetRef.current = offset
  }, [offset])

  const getPostData = useCallback(async (currentOffset) => {
    const token = localStorage.getItem('token')
    setLoading(true)
    try {
      const response = await axios.get(`${link}/user/posts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { offset: currentOffset, limit: LIMIT },
      })
      const newPosts = response.data.posts || []
      if (isMounted.current) {
        setPosts((prev) => [...prev, ...newPosts])
        setHasMore(newPosts.length === LIMIT)
        setOffset((prev) => prev + newPosts.length)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    getPostData(0)
    return () => {
      isMounted.current = false
    }
  }, [getPostData])

  useEffect(() => {
    const handleResize = () => {
      if (isMounted.current) {
        setIsMobile(window.innerWidth <= 820)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!hasMore || loading) return

    const container = mainRef.current

    const handleScroll = throttle(() => {
      if (!container) return
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight

      if (scrollTop + clientHeight >= scrollHeight - 150 && hasMore && !loading) {
        getPostData(offsetRef.current)
      }
    }, 200)

    if (isMobile && container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    } else {
      // Для десктопа слушаем скролл окна
      const handleWindowScroll = throttle(() => {
        const scrollTop = window.scrollY || window.pageYOffset
        const windowHeight = window.innerHeight
        const fullHeight = document.documentElement.scrollHeight
        if (scrollTop + windowHeight >= fullHeight - 150 && hasMore && !loading) {
          getPostData(offsetRef.current)
        }
      }, 200)

      window.addEventListener('scroll', handleWindowScroll)
      return () => window.removeEventListener('scroll', handleWindowScroll)
    }
  }, [hasMore, loading, getPostData, isMobile])

  return (
    <div className="container" id="root">
      {isMobile ? <FixedHeader /> : <Header currentPage="feed" />}
      <div
        className="main"
        ref={mainRef}
        style={{
          overflowY: isMobile ? 'auto' : 'visible',
          overflowX: 'hidden',
          height: isMobile ? '100vh' : 'auto',
        }}
      >
        {isMobile && <MobileHeader />}
        <Posts posts={posts} />
        {loading && (
          <div style={{ textAlign: 'center', padding: '10px', color: 'white' }}>Загрузка...</div>
        )}
        {!hasMore && !loading && (
          <div style={{ textAlign: 'center', padding: '10px', color: 'white' }}>
            Больше постов нет
          </div>
        )}
      </div>
      {isMobile && <MobileFooter />}
    </div>
  )
}

export default FeedMobile
