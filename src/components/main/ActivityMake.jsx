import React, { useState, useEffect } from 'react'
import { ErrorModal } from '@components/modals/index.js'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '@shared/services/api'
import { formatDateToInput } from '@shared/utils/activity'
import { uploadToStorage } from '@shared/services/uploadService'
import { useResponsive, useAppHeight } from '@shared/hooks'
import { createApiHandler, handleApiError } from '@shared/utils'
import ActivityTypePicker from '@components/activity/ActivityTypePicker.jsx'
import ActivityParamsForm from '@components/activity/ActivityParamsForm.jsx'
import ActivityMediaUpload from '@components/activity/ActivityMediaUpload.jsx'
import ActivityActions from '@components/activity/ActivityActions.jsx'
import ActivitySubmitButton from '@components/activity/ActivitySubmitButton.jsx'

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
  const isMobile = useResponsive()
  useAppHeight()
  const [isFocused, setIsFocused] = useState(false)

  const validateFields = () => {
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

    const startDateTime = new Date(`${activityStartDate}T${activityStartTime}`)
    const now = new Date()

    if (startDateTime > now) {
      errors.activityStartTime = true
      errors.activityStartDate = true
      setModalErrorMessage('Дата и время начала не могут быть в будущем.')
      setIsErrorModalOpen(true)
    }

    setRequiredFields(errors)
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
    api
      .get('/user/list_of_activities')
      .then(
        createApiHandler(
          (data) => setActivityTypes(data.activities),
          (error) => console.error('Error loading activities:', error),
        ),
      )
      .catch((error) => handleApiError(error))
  }, [activityData])

  const handleFormChange = () => {
    navigate(`/activity`, { state: { page: 'activity' } })
  }

  const handleActivityImageChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const uploadedUrl = await uploadToStorage('users/uploads/activity/', file)
        setActivityImage(uploadedUrl)
      } catch (error) {
        console.error('Error uploading image:', error)
      }
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
        <ActivityActions onFormChange={handleFormChange} />
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <ActivityTypePicker
          activityTypes={activityTypes}
          activityTag={activityTag}
          otherActivityTag={otherActivityTag}
          isMobile={isMobile}
          onActivityTypeChange={handleActivityTypeChange}
          onOtherActivityTagChange={setOtherActivityTag}
        />

        <ActivityParamsForm
          activityTag={activityTag}
          activityStartDate={activityStartDate}
          activityStartTime={activityStartTime}
          activityDuration={activityDuration}
          activityStep={activityStep}
          activityDistance={activityDistance}
          requiredFields={requiredFields}
          onInputChange={handleInputChange}
          onValidateFields={validateFields}
          onKeyPress={handleKeyPress}
        />

        <ActivityMediaUpload
          activityDescription={activityDescription}
          activityImage={activityImage}
          onDescriptionChange={handleActivityDescriptionChange}
          onImageChange={handleActivityImageChange}
        />

        <ActivitySubmitButton />
      </form>
      {isErrorModalOpen && (
        <ErrorModal message={modalErrorMessage} onClose={() => setIsErrorModalOpen(false)} />
      )}
    </div>
  )
}

export default ActivityMake
