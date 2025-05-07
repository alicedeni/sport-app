import React, { useState, useEffect } from 'react'
import { ButtonEnter } from '../Buttons'
import ErrorModal from './ErrorModal'
import { useNavigate, useLocation } from 'react-router-dom'
import photoPost from '../../assets/icons/photoPost.svg'
import axios from 'axios'
import CustomTimePicker from './CustomTimePicker'

import { link } from '../../consts.js'

const ActivityMake = () => {
  const location = useLocation()
  const { activityData } = location.state || {}
  const [activityTypes, setActivityTypes] = useState([])
  const [activityType, setActivityType] = useState('')
  const [activityTag, setActivityTag] = useState('')
  const [otherActivityTag, setOtherActivityTag] = useState('')
  const [activityStartDate, setActivityStartDate] = useState('')
  const [activityEndDate, setActivityEndDate] = useState('')
  const [activityStep, setActivityStep] = useState('')
  const [activityStartTime, setActivityStartTime] = useState('')
  const [activityEndTime, setActivityEndTime] = useState('')
  const [activityDuration, setActivityDuration] = useState('')
  const [activityDistance, setActivityDistance] = useState('')
  const [activityCalories, setActivityCalories] = useState('')
  const [activityVerification, setActivityVerification] = useState(null)
  const [activityImage, setActivityImage] = useState(null)
  const [activityDescription, setActivityDescription] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [requiredFields, setRequiredFields] = useState({
    activityTag: false,
    activityStartDate: false,
    activityStartTime: false,
    activityDuration: false,
    activityStep: false,
    activityDistance: false,
  })
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [modalErrorMessage, setModalErrorMessage] = useState('')
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const formatDateToInput = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const validateFields = () => {
    console.log('1', activityStep, activityTag, activityTag, activityStartTime, activityEndTime)
    let errors = {
      activityTag: !activityTag,
      activityStartDate: !activityStartDate,
      activityStartTime: !activityStartTime,
      activityDuration:
        ['yoga', 'power', 'dance', 'game', 'other', 'cardio'].includes(activityTag) &&
        (!activityDuration || activityDuration === '00:00'),
      activityStep: activityTag === 'walk' && !activityStep,
      activityDistance:
        ['bike', 'pool', 'run'].includes(activityTag) &&
        (!activityDistance || activityDistance === '0'),
    }
    console.log(errors)

    const startDateTime = new Date(`${activityStartDate}T${activityStartTime}`)
    const now = new Date()

    if (startDateTime > now) {
      errors.activityStartTime = true
      errors.activityStartDate = true
      setModalErrorMessage('Дата и время начала не могут быть в будущем.')
      setIsErrorModalOpen(true)
    }

    setRequiredFields(errors)
    console.log(requiredFields)
    return !Object.values(errors).some((field) => field)
  }

  const handleInputChange = (field, value) => {
    setRequiredFields((prev) => ({ ...prev, [field]: false }))
    if (field === 'activityStartDate') setActivityStartDate(value)
    if (field === 'activityStartTime') setActivityStartTime(value)
    if (field === 'activityDuration') setActivityDuration(value)
    if (field === 'activityStep') setActivityStep(value)
    if (field === 'activityDistance') setActivityDistance(value)
  }

  useEffect(() => {
    const today = new Date()
    setActivityStartDate(formatDateToInput(today))
    setActivityEndDate(formatDateToInput(today))

    if (activityData) {
      setActivityType(activityData.tag)
      setActivityTag(activityData.type)
      setActivityStartDate(activityData.startDate)
      setActivityStep(activityData.step)
      setActivityStartTime(activityData.startTime)
      setActivityDistance(activityData.distance)
      setActivityDuration(activityData.duration)
      setActivityCalories(activityData.calories)
      setActivityVerification(activityData.verification)
      setActivityImage(activityData.image)
      setActivityDescription(activityData.description)
      setOtherActivityTag(activityData.other)
    }
    const token = localStorage.getItem('token')
    axios
      .get(`${link}/user/list_of_activities`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.status === 200) {
          setActivityTypes(response.data.activities)
        } else {
          console.error('Error loading activities:', response.data.message)
        }
      })
      .catch((error) => {
        console.error('Error loading activities:', error)
      })
  }, [activityData])

  const handleFormChange = () => {
    navigate(`/activity`, { state: { page: 'activity' } })
  }

  const getImgKeys = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${link}/img_keys`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const handleActivityImageChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const uploadedUrl = await uploadFile(file)
        setActivityImage(uploadedUrl)
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }
  }

  const uploadFile = async (file) => {
    const presignedFields = await getImgKeys()
    const token = localStorage.getItem('token')
    const userId = token
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${userId}_${timestamp}.${fileExtension}`

    const formData = new FormData()
    formData.append('key', `users/uploads/activity/${fileName}`)
    formData.append('X-Amz-Credential', presignedFields['fields']['x-amz-credential'])
    formData.append('acl', 'public-read')
    formData.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256')
    formData.append('X-Amz-Date', presignedFields['fields']['x-amz-date'])
    formData.append('policy', presignedFields['fields']['policy'])
    formData.append('X-Amz-Signature', presignedFields['fields']['x-amz-signature'])
    formData.append('file', file)

    try {
      await axios.post('https://storage.yandexcloud.net/team2go', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return `https://storage.yandexcloud.net/team2go/users/uploads/activity/${fileName}`
    } catch (error) {
      throw new Error('File upload failed')
    }
  }

  const handleActivityDescriptionChange = (description) => {
    setActivityDescription(description)
  }

  const handleActivityTypeChange = (activity) => {
    setActivityType(activity.type)
    setActivityTag(activity.tag)
    if (activity.tag !== 'other') {
      setOtherActivityTag('')
    }
    setActivityStep('')
    setActivityEndTime('')
    setActivityDuration('')
    setActivityDistance('')
    setActivityCalories('')
  }

  const handleKeyPress = (event) => {
    if (!/[0-9,.]/.test(event.key)) {
      event.preventDefault()
    }
  }

  const handleSaveActivity = (event) => {
    event.preventDefault()

    const newRequiredFields = {
      activityTag: !activityTag,
      activityStartDate: !activityStartDate,
      activityStartTime: !activityStartTime,
      activityDuration:
        ['yoga', 'power', 'dance', 'game', 'other', 'cardio'].includes(activityTag) &&
        (!activityDuration || activityDuration === '00:00'),
      activityStep: activityTag === 'walk' && !activityStep,
      activityDistance:
        ['bike', 'pool', 'run'].includes(activityTag) &&
        (!activityDistance || activityDistance === '0'),
    }

    setRequiredFields((prevFields) => ({
      ...prevFields,
      ...newRequiredFields,
    }))

    if (Object.values(newRequiredFields).some((field) => field)) {
      setModalErrorMessage('Пожалуйста, заполните все обязательные поля')
      setIsErrorModalOpen(true)
      return
    }
    const finalTag = otherActivityTag ? otherActivityTag : activityType

    const startDateTime = new Date(`${activityStartDate}T${activityStartTime}`)
    const endDateTime = new Date(`${activityEndDate}T${activityEndTime}`)
    const now = new Date()

    if (startDateTime > now) {
      setModalErrorMessage('Дата и время начала не могут быть в будущем.')
      setIsErrorModalOpen(true)
      setRequiredFields((prevFields) => ({
        ...prevFields,
        activityStartDate: true,
        activityStartTime: true,
      }))
      return
    }

    const activityData = {
      type: activityTag,
      tag: finalTag,
      time: activityDuration,
      startDate: activityStartDate,
      endDate: activityEndDate,
      step: activityStep,
      startTime: activityStartTime,
      endTime: activityEndTime,
      duration: activityDuration,
      distance: activityDistance,
      calories: activityCalories,
      verification: activityVerification,
      image: activityImage,
      description: activityDescription,
      other: otherActivityTag,
    }

    navigate(`/preview`, { state: { activityData, page: 'view' } })
  }

  return (
    <div className="activity">
      <form onSubmit={handleSaveActivity}>
        <div className="activity-return">
          <button className="activity-return__prev" onClick={handleFormChange}>
            &lt;
          </button>
          <div>Добавление активности</div>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="activity-input">
          <div className="activity-input-title">
            <div className="activity-input-title-number">1</div>
            Выберите вид активности <span style={{ color: 'red' }}>*</span>
          </div>
          <div className="activity-input-content">
            {activityTypes.map((activity) => (
              <div
                key={activity.type}
                id={activity.tag}
                className={`activity-btn${isMobile ? `-mobile` : ``} ${
                  activityTag === activity.tag ? `${activity.tag}-bold` : `${activity.tag}-light`
                }`}
                onClick={() => handleActivityTypeChange(activity)}
              >
                {activity.type.toUpperCase()}
              </div>
            ))}

            {activityTag === 'other' && (
              <div className="activity-input-content-item">
                <input
                  className="activity-input-content-item-field-other"
                  type="text"
                  value={otherActivityTag}
                  onChange={(e) => setOtherActivityTag(e.target.value)}
                  placeholder="Название активности"
                />
              </div>
            )}
          </div>
        </div>
        <div className="activity-input">
          <div className="activity-input-title">
            <div className="activity-input-title-number">2</div>
            Введите данные об активности <span style={{ color: 'red' }}>*</span>
          </div>
          <div className="activity-input-content" style={{ flexDirection: 'colunmn' }}>
            <div className="activity-input-content" style={{ marginLeft: '0px' }}>
              <div className="activity-input-content-item">
                <label className="activity-input-content-item-name">Дата начала</label>
                <input
                  className={`activity-input-content-item-field ${requiredFields.activityStartDate ? 'error' : ''}`}
                  type="date"
                  value={activityStartDate}
                  onChange={(e) => handleInputChange('activityStartDate', e.target.value)}
                  onBlur={validateFields}
                />
              </div>
              <div className="activity-input-content-item">
                <label className="activity-input-content-item-name">Время начала (чч:мм)</label>
                {/*<input*/}
                {/*  className={`activity-input-content-item-field ${requiredFields.activityStartTime ? 'error' : ''}`}*/}
                {/*  type="time"*/}
                {/*  value={activityStartTime}*/}
                {/*  onChange={(e) => handleInputChange('activityStartTime', e.target.value)}*/}
                {/*  onBlur={validateFields}*/}
                {/*/>*/}
                <CustomTimePicker
                  value={activityStartTime}
                  onChange={(value) => handleInputChange('activityStartTime', value)}
                  onBlur={validateFields}
                  error={requiredFields.activityStartTime}
                />
              </div>
              {['yoga', 'power', 'dance', 'game', 'other', 'cardio'].includes(activityTag) && (
                <div className="activity-input-content-item">
                  <label className="activity-input-content-item-name">Длительность (чч:мм)</label>
                  {/*<input*/}
                  {/*  className={`activity-input-content-item-field ${requiredFields.activityDuration ? 'error' : ''}`}*/}
                  {/*  type="time"*/}
                  {/*  value={activityDuration}*/}
                  {/*  onFocus={() => setIsFocused(true)}*/}
                  {/*  onChange={(e) => handleInputChange('activityDuration', e.target.value)}*/}
                  {/*  onBlur={validateFields}*/}
                  {/*/>*/}
                  <CustomTimePicker
                    value={activityDuration}
                    onChange={(value) => handleInputChange('activityDuration', value)}
                    onBlur={validateFields}
                    error={requiredFields.activityDuration}
                  />
                </div>
              )}
              {['walk'].includes(activityTag) && (
                <div className="activity-input-content-item">
                  <label className="activity-input-content-item-name">Шаги</label>
                  <input
                    className={`activity-input-content-item-field ${requiredFields.activityStep ? 'error' : ''}`}
                    type="number"
                    value={activityStep}
                    onChange={(e) => handleInputChange('activityStep', e.target.value)}
                    onKeyPress={handleKeyPress}
                    min="1"
                    onBlur={validateFields}
                  />
                </div>
              )}
              {['pool', 'bike', 'run'].includes(activityTag) && (
                <div className="activity-input-content-item">
                  <label className="activity-input-content-item-name">Дистанция</label>
                  <input
                    className={`activity-input-content-item-field ${requiredFields.activityDistance ? 'error' : ''}`}
                    type="number"
                    value={activityDistance}
                    onChange={(e) => handleInputChange('activityDistance', e.target.value)}
                    onKeyPress={handleKeyPress}
                    min="0"
                    step="0.01"
                    onBlur={validateFields}
                  />
                  <label className="calories-label">{activityTag === 'pool' ? 'м' : 'км'}</label>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="activity-input">
          <div className="activity-input-title">
            <div className="activity-input-title-number">3</div>
            Дополнительные данные
          </div>
          <div className="activity-input-content">
            <textarea
              className="activity-input-content-description"
              value={activityDescription}
              onChange={(e) => handleActivityDescriptionChange(e.target.value)}
              placeholder="Здесь вы можете добавить комментарий к активности (до 500 символов)"
              maxLength={500}
            ></textarea>
            <div className="activity-input-content-image">
              {activityImage ? (
                <>
                  <img src={activityImage} alt="Activity Image" />
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleActivityImageChange}
                  />
                </>
              ) : (
                <>
                  <img
                    src={photoPost}
                    alt="Add Photo Icon"
                    style={{ marginBottom: '8px', width: '40px' }}
                  />
                  <label>Добавить фото активности</label>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleActivityImageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="activity-submit_btn">
          <ButtonEnter
            className="welcome-block__btn"
            text="Далее"
            type="submit"
            textContent={'Далее'}
          ></ButtonEnter>
        </div>
      </form>
      {isErrorModalOpen && (
        <ErrorModal message={modalErrorMessage} onClose={() => setIsErrorModalOpen(false)} />
      )}
    </div>
  )
}

export default ActivityMake
