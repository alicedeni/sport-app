import React, { useEffect, useState } from 'react'
import Post from './Post'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { link } from '../../consts'

const Posts = ({ posts }) => {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState(null)
  const [userId, setUserId] = useState({})

  const getUserData = () => {
    const token = localStorage.getItem('token')
    return axios
      .get(`${link}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserId(response.data.profile.id)
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  }

  useEffect(() => {
    getUserData()
      .then((data) => {
        return data
      })
      .catch((error) => console.error(error))
  }, [])

  const uniqueTypes = Array.from(new Set(posts.map((post) => post.type).filter(Boolean)))
  const filters = ['my_activities', ...uniqueTypes]
  const filteredPosts = selectedType
    ? posts.filter((post) => {
        if (selectedType === 'my_activities') {
          console.log(post.id, userId)
          return post.id === userId
        }
        return post.type === selectedType
      })
    : posts

  return (
    <div className="posts">
      {/*<div className="posts__header">
        <button className="posts__add-button" onClick={() => navigate('/activity_make')}>
          <img
            src="https://storage.yandexcloud.net/team2go/users/base/plusIcon.svg"
            alt="Добавить"
          />
        </button>

        <div className="posts__filter">
          {[selectedType, ...filters.filter((f) => f !== selectedType)].map((filter) => (
            <button
              key={filter}
              className={`posts__filter-item ${selectedType === filter ? 'active' : ''}`}
              onClick={() => {
                if (selectedType === filter) {
                  setSelectedType(null)
                } else {
                  setSelectedType(filter)
                }
              }}
            >
              {filter === 'my_activities' ? 'МОИ АКТИВНОСТИ' : filter?.toUpperCase()}
              {selectedType === filter && (
                <span
                  className="close-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedType(null)
                  }}
                >
                  ×
                </span>
              )}
            </button>
          ))}
        </div>
      </div>*/}

      {filteredPosts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  )
}

export default Posts
