import React, { useState, useEffect, useRef, useCallback } from 'react'
import throttle from 'lodash.throttle'
import Header from '@components/main/Header.jsx'
import MobileHeader from '@components/mobile/MobileHeader'
import MobileFooter from '@components/mobile/MobileFooter'
import Posts from '@components/main/Posts.jsx'
import api from '@shared/services/api'
import { ROUTE_NAMES } from '@constants/routes.js'
import logger from '@shared/utils/logger'

const LIMIT = 20

const FeedDesktop = () => {
  const [posts, setPosts] = useState([])
  const isMounted = useRef(true)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const offsetRef = useRef(offset)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820)
  const [filters, setFilters] = useState({
    activity: '',
    username: '',
    team: '',
    my_posts: false,
  })

  useEffect(() => {
    offsetRef.current = offset
  }, [offset])

  const getPostData = useCallback(async (currentOffset, currentFilters) => {
    setLoading(true)
    try {
      const params = {
        offset: currentOffset,
        limit: LIMIT,
        ...currentFilters,
      }
      if (params.my_posts) params.my_posts = 'true'
      else delete params.my_posts

      const response = await api.get('/user/posts', { params })
      const newPosts = response.data.posts || []
      if (isMounted.current) {
        if (currentOffset === 0) {
          setPosts(newPosts)
        } else {
          setPosts((prev) => [...prev, ...newPosts])
        }
        setHasMore(newPosts.length === LIMIT)
        setOffset(currentOffset + newPosts.length)
      }
    } catch (error) {
      logger.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    setOffset(0)
    setHasMore(true)
    getPostData(0, filters)
    return () => {
      isMounted.current = false
    }
  }, [filters, getPostData])

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

    const handleWindowScroll = throttle(() => {
      const scrollTop = window.scrollY || window.pageYOffset
      const windowHeight = window.innerHeight
      const fullHeight = document.documentElement.scrollHeight
      if (scrollTop + windowHeight >= fullHeight - 150 && hasMore && !loading) {
        getPostData(offsetRef.current, filters)
      }
    }, 200)

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [hasMore, loading, getPostData, filters])

  return (
    <div className="container" id="root">
      {isMobile ? <MobileHeader /> : <Header currentPage={ROUTE_NAMES.FEED} />}
      <div className="main">
        <Posts posts={posts} filters={filters} setFilters={setFilters} />
        {loading && (
          <div className="loading-message">Загрузка...</div>
        )}
        {!hasMore && !loading && posts.length > 0 && (
          <div className="no-more-posts">
            Больше постов нет
          </div>
        )}
      </div>
      {isMobile && <MobileFooter />}
    </div>
  )
}

export default FeedDesktop
