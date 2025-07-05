import React, { useState, useEffect, useRef, useCallback } from 'react'
import throttle from 'lodash.throttle'
import Header from '../components/main/Header'
import MobileHeader from '@components/mobile/MobileHeader'
import MobileFooter from '@components/mobile/MobileFooter'
import Posts from '../components/main/Posts'
import axios from 'axios'

import { link } from '../consts.js'

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

  // Обновляем ref при изменении offset для доступа из обработчиков
  useEffect(() => {
    offsetRef.current = offset
  }, [offset])

  // Функция загрузки постов с учетом offset и фильтров
  const getPostData = useCallback(async (currentOffset, currentFilters) => {
    const token = localStorage.getItem('token')
    setLoading(true)
    try {
      const params = {
        offset: currentOffset,
        limit: LIMIT,
        ...currentFilters,
      }
      // Преобразуем булев my_posts в строку 'true' для API
      if (params.my_posts) params.my_posts = 'true'
      else delete params.my_posts

      const response = await axios.get(`${link}/user/posts`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      const newPosts = response.data.posts || []
      if (isMounted.current) {
        if (currentOffset === 0) {
          // При загрузке с нуля заменяем посты
          setPosts(newPosts)
        } else {
          // При подгрузке добавляем новые посты
          setPosts((prev) => [...prev, ...newPosts])
        }
        setHasMore(newPosts.length === LIMIT)
        setOffset(currentOffset + newPosts.length)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // При изменении фильтров сбрасываем offset и загружаем заново
  useEffect(() => {
    isMounted.current = true
    setOffset(0)
    setHasMore(true)
    getPostData(0, filters)
    return () => {
      isMounted.current = false
    }
  }, [filters, getPostData])

  // Обработка изменения размера окна для мобильного режима
  useEffect(() => {
    const handleResize = () => {
      if (isMounted.current) {
        setIsMobile(window.innerWidth <= 820)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Обработчик скролла для подгрузки постов при достижении низа страницы
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
      {isMobile ? <MobileHeader /> : <Header currentPage="feed" />}
      <div className="main">
        <Posts posts={posts} filters={filters} setFilters={setFilters} />
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

export default FeedDesktop
