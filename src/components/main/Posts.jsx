import React, { useEffect, useState, useRef, useMemo } from 'react'
import Select from 'react-select'
import Post from './Post'

const ACTIVITY_OPTIONS = [
  { label: 'Ходьба', value: 'walk' },
  { label: 'Бег', value: 'run' },
  { label: 'Плавание', value: 'pool' },
  { label: 'Кардио', value: 'cardio' },
  { label: 'Силовая тренировка', value: 'power' },
  { label: 'Велотренировка', value: 'bike' },
  { label: 'Танцы', value: 'dance' },
  { label: 'Спортивные игры', value: 'game' },
  { label: 'Йога', value: 'yoga' },
  { label: 'Другое', value: 'other' },
]

const Posts = ({ posts, filters, setFilters }) => {
  const [userId, setUserId] = useState(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    // Получаем id пользователя для фильтра "Мои посты"
    const token = localStorage.getItem('token')
    fetch('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted.current && data.profile) {
          setUserId(data.profile.id)
        }
      })
      .catch(console.error)

    return () => {
      isMounted.current = false
    }
  }, [])

  // Локальная фильтрация (если нужно)
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (filters.activity && filters.activity !== '') {
        if (post.tag !== filters.activity) return false
      }
      if (filters.my_posts && userId !== null) {
        if (post.id !== userId) return false
      }
      if (filters.username) {
        const fullName = `${post.username} ${post.name}`.toLowerCase()
        if (!fullName.includes(filters.username.toLowerCase())) return false
      }
      if (filters.team) {
        if (!post.teamId || String(post.teamId) !== String(filters.team)) return false
      }
      return true
    })
  }, [posts, filters, userId])

  // Обработчики изменения фильтров
  const onActivityChange = (selected) => {
    setFilters((prev) => ({ ...prev, activity: selected ? selected.value : '' }))
  }

  const onUsernameChange = (e) => {
    setFilters((prev) => ({ ...prev, username: e.target.value }))
  }

  const toggleMyPosts = () => {
    setFilters((prev) => ({ ...prev, my_posts: !prev.my_posts }))
  }

  const selectOptions = [{ label: 'Все', value: '' }, ...ACTIVITY_OPTIONS]

  return (
    <div className="posts">
      <div className="posts__filters">
        <div className="posts__button-wrapper">
          <button
            className={`posts__my-posts-button ${filters.my_posts ? 'active' : ''}`}
            onClick={toggleMyPosts}
            type="button"
          >
            {filters.my_posts ? 'Показать все' : 'Мои посты'}
          </button>
        </div>

        <div className="posts__filter-group" style={{ minWidth: 180 }}>
          <label htmlFor="activityTypeSelect">Вид активности:</label>
          <Select
            inputId="activityTypeSelect"
            options={selectOptions}
            value={selectOptions.find((opt) => opt.value === filters.activity) || null}
            onChange={onActivityChange}
            isClearable
            placeholder="Выберите вид активности"
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: '#fff',
                borderRadius: 20,
                border: `2px solid #51B8FF`,
                minHeight: 40,
                boxShadow: state.isFocused ? '0 0 0 1px #51B8FF' : 'none',
                '&:hover': {
                  borderColor: '#51B8FF',
                },
              }),
              placeholder: (base) => ({
                ...base,
                color: '#BDBDBD',
                fontSize: 15,
              }),
              singleValue: (base) => ({
                ...base,
                color: '#000',
                fontSize: 15,
              }),
              input: (base) => ({
                ...base,
                color: '#000',
                fontSize: 15,
                margin: 0,
                padding: 0,
              }),
              menu: (base) => ({
                ...base,
                borderRadius: 12,
                marginTop: 4,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                maxHeight: 200,
                overflow: 'hidden',
              }),
              menuList: (base) => ({
                ...base,
                maxHeight: 200,
                overflowY: 'auto',
                whiteSpace: 'normal',
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected
                  ? '#51B8FF'
                  : isFocused
                    ? 'rgba(81, 184, 255, 0.2)'
                    : 'white',
                color: isSelected ? 'white' : '#000',
                padding: '10px 12px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                cursor: 'pointer',
              }),
              clearIndicator: (base) => ({
                ...base,
                padding: 4,
                cursor: 'pointer',
                color: '#51B8FF',
                '&:hover': {
                  color: '#007bff',
                },
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: 4,
                cursor: 'pointer',
                color: '#51B8FF',
                '&:hover': {
                  color: '#007bff',
                },
              }),
            }}
          />
        </div>

        <div className="posts__filter-group">
          <label htmlFor="usernameFilterInput">Имя пользователя:</label>
          <input
            id="usernameFilterInput"
            type="text"
            placeholder="Поиск по имени"
            value={filters.username}
            onChange={onUsernameChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 20,
              border: '2px solid #51B8FF',
              fontSize: 15,
              outline: 'none',
              color: '#000',
              backgroundColor: '#fff',
            }}
          />
        </div>
      </div>

      {filteredPosts.length === 0 && <div className="posts__no-results">Посты не найдены</div>}

      {filteredPosts.map((post, index) => (
        <Post key={`${post.feed_id}-${index}`} post={post} />
      ))}
    </div>
  )
}

export default Posts
