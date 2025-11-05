import React, { useState, useEffect } from 'react'
import { ButtonActivity, ButtonEnter } from '@components/Buttons'
import { WarningModal } from '@components/modals'
import { useNavigate } from 'react-router-dom'
import api from '@shared/services/api'
import logger from '@shared/utils/logger'

const Activity = () => {
  const [selectedSide, setSelectedSide] = useState('week')
  const [activities, setActivities] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        let response
        if (selectedSide === 'week') {
          response = await api.get('/user/activities/week')
        } else if (selectedSide === 'month') {
          response = await api.get('/user/activities/month')
        } else {
          response = await api.get('/user/activities/all')
        }
        setActivities(response.data.activities)
      } catch (error) {
        logger.error('Error fetching activities:', error)
      }
    }
    fetchActivities()
  }, [selectedSide])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile')
        setProfile(response.data.profile)
      } catch (error) {
        logger.error('Error fetching profile:', error)
        setProfile(null)
      }
    }
    fetchProfile()
  }, [])

  const handleClick = (side) => {
    setSelectedSide(side)
  }

  const handleFormChange = () => {
    if (
      !profile ||
      !profile.height ||
      !profile.weight ||
      Number(profile.height) === 0 ||
      Number(profile.weight) === 0
    ) {
      openModal()
    } else {
      navigate(`/activity_make`, { state: { page: 'activity' } })
    }
  }

  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  const formatMinutesToHours = (totalMinutes) => {
    const safe = Math.max(0, Math.floor(totalMinutes))
    const hours = Math.floor(safe / 60)
    const minutes = safe % 60
    const minutesStr = minutes < 10 ? `0${minutes}` : String(minutes)
    return `${hours}:${minutesStr}`
  }

  const getTotalTime = () => {
    const totalMinutes = activities.reduce(
      (total, activity) => total + parseTimeToMinutes(activity.time),
      0,
    )
    return formatMinutesToHours(totalMinutes)
  }

  const getPeriodText = () => {
    switch (selectedSide) {
      case 'week':
        return 'за неделю'
      case 'month':
        return 'за месяц'
      case 'week && month':
        return 'за все время'
      default:
        return ''
    }
  }

  return (
    <div className="activity">
      <ButtonActivity
        className="welcome-block__btn"
        text="Добавить активность"
        textContent={'Добавить активность'}
        onClick={handleFormChange}
      ></ButtonActivity>
      <div className="select_time">
        <div
          className={`select_time-variant ${selectedSide === 'week' ? 'active' : ''}`}
          onClick={() => handleClick('week')}
        >
          За неделю
        </div>
        <div
          className={`select_time-variant ${selectedSide === 'month' ? 'active' : ''}`}
          onClick={() => handleClick('month')}
        >
          За месяц
        </div>
        <div
          className={`select_time-variant ${selectedSide === 'week && month' ? 'active' : ''}`}
          onClick={() => handleClick('week && month')}
        >
          За все время
        </div>
      </div>
      <div className="activity-total">
        Всего: {getTotalTime()} часов активности {getPeriodText()}
      </div>

      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-list-item">
            <div
              key={activity.type}
              id={activity.tag}
              className={`activity-tags ${activity.tag}-M`}
            >
              {activity.type.toUpperCase()}
            </div>
            <div className={`activity-list-item-time ${activity.tag}`}>{activity.time} часов</div>
            {selectedSide !== 'week && month' && (
              <div className="activity-list-item-average">
                В среднем {activity.average} минуты в день
              </div>
            )}
          </div>
        ))}
      </div>
      {showModal && <WarningModal onClose={closeModal} />}
    </div>
  )
}

export default Activity
