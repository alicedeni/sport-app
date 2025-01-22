import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ButtonEnter } from '../Buttons'
import { Avatar } from '@material-ui/core'
import axios from 'axios'
import ReactDOM from 'react-dom'

import { link } from '../../consts.js'

ReactDOM.findDOMNode = () => {}
ReactDOM.createPortal = () => {}

const Preview = () => {
  const { state } = useLocation()
  const { activityData } = state
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const hasImage = activityData && activityData.image
  const isMounted = useRef(true)

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

  const handlePreview = () => {
    if (!activityData) {
      console.error('Данные активности отсутствуют')
      return
    }

    const token = localStorage.getItem('token')
    axios
      .post(`${link}/user/preview_post`, activityData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    console.log(activityData)
    getUserData()
      .then((data) => {
        if (data && data.profile) {
          setUser(data.profile)
        }
      })
      .catch((error) => console.error(error))

    handlePreview()
    return () => {
      isMounted.current = false
    }
  }, [])

  const handlePublish = () => {
    if (!activityData) {
      console.error('Данные активности отсутствуют')
      return
    }
    /*
    if (!activityData.image) {
      activityData.image = `https://storage.yandexcloud.net/team2go/users/base/${activityData.type}.png`;
    }*/
    const token = localStorage.getItem('token')
    axios
      .post(`${link}/user/activities`, activityData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.status === 200) {
          console.log('Активность успешно опубликована')
          window.location.href = `/main`
        } else {
          console.error('Ошибка при публикации активности:', response.data.error)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleBack = () => {
    if (activityData) {
      navigate(`/activity_make`, { state: { page: 'activity', activityData } })
    } else {
      console.error('Данные активности отсутствуют')
    }
  }

  return (
    <div className="preview">
      <div className="preview-return">
        <button className="preview-return__prev" onClick={handleBack}>
          &lt;
        </button>
        <div>Публикация активности</div>
      </div>
      <div className="post">
        <div className="post__header">
          {user.avatar ? (
            <Avatar className="post__mini-avatar" src={user.avatar} alt="avatar" />
          ) : (
            <Avatar className="post__mini-avatar" src={user.avatar} alt="avatar" />
          )}
          <div className="post__user-info">
            <div className="post__svg-fire-container">
              <div className="preview-post__username">
                {user.lastName} {user.firstName}
              </div>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.4006 27.6937C17.2411 28.0524 17.5086 28.4685 17.8968 28.411C22.6002 27.7139 25.5 23.5418 25.5 18.4992C25.5 15.9861 25.0965 12.13 22.3843 10.1754C22.2387 10.0705 22.0486 10.2362 22.1055 10.407C22.4411 11.4139 22.5 13.5 21.5 13.5C20.5 13.5 20.89 12.4781 20.6806 11.3092C20.5567 10.6172 20.4079 9.78662 20.0714 8.94027C19.2108 6.7753 17.5314 3.78656 12.6971 3.50027C12.5065 3.48898 12.3798 3.83213 12.4962 3.9845C13.9003 5.82401 14.5101 11.5 12.5 11.5C11.2779 11.5 11.4041 9.37078 12.1256 7.67401C12.1963 7.50762 12.0142 7.34151 11.8633 7.44003C6.92323 10.6652 6.5 15.9253 6.5 18.4992C6.5 23.5418 9.39983 27.7139 14.1032 28.411C14.4914 28.4685 14.7589 28.0524 14.5994 27.6937C14.1613 26.7084 13.7381 25.3583 13.7381 23.8689C13.7381 20.32 15.3235 18.7871 15.7965 18.044C15.8945 17.89 16.1055 17.89 16.2035 18.044C16.6765 18.7871 18.2619 20.32 18.2619 23.8689C18.2619 25.3583 17.8387 26.7084 17.4006 27.6937Z"
                  fill="url(#paint0_linear_1096_2207)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1096_2207"
                    x1="6.5"
                    y1="28.5"
                    x2="27.9857"
                    y2="26.1412"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9D9DE6" />
                    <stop offset="0.427083" stopColor="#567FE3" />
                    <stop offset="0.885417" stopColor="#9664C8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="post__fire-count">{user.fireCount}</div>
            </div>
            <div className="post__timestamp">Предпросмотр</div>
          </div>
        </div>
        <div className={`post__content ${hasImage ? '' : 'post__content-svg'}`}>
          <div className={`post__image-container ${hasImage ? '' : 'post__image-container-svg'}`}>
            {hasImage ? (
              <img className="post__image" src={activityData.image} alt="Post image" />
            ) : (
              <img
                className="post__image"
                src={`https://storage.yandexcloud.net/team2go/users/base/${activityData.type}.svg`}
                alt={`${activityData.type} activity`}
              />
            )}
          </div>
          <div className="post__info">
            <div className="post__title">
              {activityData && (
                <div id={activityData.type} className={`activity-btn ${activityData.type}-bold`}>
                  {activityData.tag.toUpperCase()}
                </div>
              )}
            </div>
            <div className="post__points">
              {activityData && activityData.duration && (
                <div className="post__points__point">
                  Время
                  <div className={`post__metric`}>
                    <div className="formatted-time">
                      {(() => {
                        const [hours, minutes] = activityData.time.split(':').map(Number)
                        if (minutes === 0) {
                          return <span>{`${hours} ч`}</span>
                        } else if (hours > 0) {
                          return <span>{`${hours} ч ${minutes} мин`}</span>
                        } else {
                          return <span>{`${minutes} мин`}</span>
                        }
                      })()}
                    </div>
                  </div>
                </div>
              )}
              {activityData && activityData.calories && (
                <div className="post__points__point">
                  Калории
                  <div className={`post__metric`}>{activityData.calories} ккал</div>
                </div>
              )}
              {activityData && activityData.step && (
                <div className="post__points__point">
                  Шаги
                  <div className={`post__metric`}>{activityData.step} шагов</div>
                </div>
              )}
              {activityData && activityData.distance && (
                <div className="post__points__point">
                  Дистанция
                  <div className={`post__metric`}>
                    {activityData.distance} {activityData.type === 'pool' ? 'м' : 'км'}
                  </div>
                </div>
              )}
            </div>
            {activityData && activityData.text && <div className="post__line"></div>}
            {activityData && <div className="post__text">{activityData.description}</div>}
          </div>
        </div>
      </div>

      <div className="preview-submit_btn">
        <ButtonEnter
          className="welcome-block__btn"
          text="Опубликовать"
          type="submit"
          textContent={'Опубликовать'}
          onClick={handlePublish}
        />
      </div>
    </div>
  )
}

export default Preview
