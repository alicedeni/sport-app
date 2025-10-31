import React, { useState, useEffect } from 'react'
import api from '@shared/services/api'
import { uploadToStorage } from '@shared/services/uploadService'
import '@aws-amplify/ui-react/styles.css'
import { FaUpload } from 'react-icons/fa'

const AccountSection = ({
  tempUser,
  editModeAccount,
  handleInputChange,
  handleCancelClickAccount,
  handleSaveClickAccount,
  handleEditClickAccount,
  handleUpdateUser,
  handlePasswordChange,
}) => {
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(tempUser.avatar)
  const [file, setFile] = useState(null)

  useEffect(() => {
    setUploadedImageUrl(tempUser.avatar)
  }, [tempUser.avatar])

  const handleImageUpload = async (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      setImageFile(selectedFile)
      const uploadedUrl = await uploadToStorage('users/uploads/profile/', selectedFile)
      setUploadedImageUrl(uploadedUrl)
      handleInputChange({ target: { value: uploadedUrl } }, 'avatar')
    }
  }

  const handleSaveClick = async () => {
    if (imageFile) {
      try {
        setImageFile(imageFile)
        const uploadedUrl = await uploadToStorage('users/uploads/profile/', imageFile)
        setUploadedImageUrl(uploadedUrl)
        handleInputChange({ target: { value: uploadedUrl } }, 'avatar')
      } catch (error) {
        alert('Ошибка при загрузке изображения. Пожалуйста, попробуйте еще раз.')
      }
    }

    await handleSaveClickAccount()
  }

  return (
    <div className="profile-block-content-data">
      <div className="profile-block-content-data-title">
        <p className="profile-block-content-data-title-name">Мой аккаунт</p>
        {editModeAccount ? (
          <>
            <button
              onClick={() => handleEditClickAccount(true)}
              className="profile-block-content-data-title-pen"
            >
              <svg
                width="22"
                height="23"
                viewBox="0 0 22 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z"
                  fill="url(#paint0_linear_580_1299)"
                  stroke="url(#paint1_linear_580_1299)"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_580_1299"
                    x1="-3.00024"
                    y1="19.5061"
                    x2="3.7211"
                    y2="25.7123"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9D9DE6" />
                    <stop offset="0.427083" stopColor="#567FE3" />
                    <stop offset="0.885417" stopColor="#9664C8" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_580_1299"
                    x1="-3.00024"
                    y1="19.5061"
                    x2="3.7211"
                    y2="25.7123"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9D9DE6" />
                    <stop offset="0.427083" stopColor="#567FE3" />
                    <stop offset="0.885417" stopColor="#9664C8" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleEditClickAccount(true)}
              className="profile-block-content-data-title-pen"
            >
              <svg
                width="22"
                height="23"
                viewBox="0 0 22 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.3845 2.53553C16.5561 1.36396 18.4556 1.36396 19.6272 2.53553C20.7988 3.70711 20.7988 5.6066 19.6272 6.77817L13.9703 12.435L8.44099 17.9644C8.00189 18.4035 7.46659 18.7343 6.87747 18.9307L1.40933 20.7534L3.23522 15.2757C3.4295 14.6929 3.75682 14.1633 4.19124 13.7288L15.3845 2.53553Z"
                  stroke="#E0E0E0"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </>
        )}
      </div>
      <div className="profile-block-content-data-line" />
      <div className="profile-block-content-data-profile">
        <div className="profile-block-content-data-item-column">
          <div className="profile-block-content-data-item-value">
            <img
              src={
                uploadedImageUrl || tempUser.avatar
                  ? uploadedImageUrl || tempUser.avatar
                  : 'https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2345549599.jpg'
              }
              alt={tempUser.name}
              className="profile-block-content-data-item-image"
            />
            {editModeAccount && (
              <>
                <label htmlFor="file-upload" className="custom-file-upload">
                  <FaUpload size={20} />
                  Загрузить фото
                  <input
                    id="file-upload"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleImageUpload}
                    required
                  />
                </label>
              </>
            )}
          </div>
        </div>
        <div className="profile-block-content-data-profile-column">
          <div className="profile-block-content-data-profile-column-i">
            <p className="profile-block-content-data-item-text">Имя</p>
            <div className="profile-block-content-data-item-value">
              {editModeAccount ? (
                <input
                  className="profile-input"
                  type="text"
                  value={tempUser.firstName}
                  onChange={(event) => handleInputChange(event, 'firstName')}
                />
              ) : (
                <p>{tempUser.firstName}</p>
              )}
            </div>
          </div>
          <div className="profile-block-content-data-profile-column-i">
            <p className="profile-block-content-data-item-text">Фамилия</p>
            <div className="profile-block-content-data-item-value">
              {editModeAccount ? (
                <input
                  className="profile-input"
                  type="text"
                  value={tempUser.lastName}
                  onChange={(event) => handleInputChange(event, 'lastName')}
                />
              ) : (
                <p>{tempUser.lastName}</p>
              )}
            </div>
          </div>
        </div>
        <div className="profile-block-content-data-profile-column">
          <div className="profile-block-content-data-profile-column-i">
            <p className="profile-block-content-data-item-text">Логин</p>
            <div className="profile-block-content-data-item-value">
              {editModeAccount ? (
                <input
                  className="profile-input"
                  type="text"
                  value={tempUser.email}
                  onChange={(event) => handleInputChange(event, 'email')}
                />
              ) : (
                <p>{tempUser.email}</p>
              )}
            </div>
          </div>
          <div className="profile-block-content-data-profile-column-i">
            <p className="profile-block-content-data-item-text">Пароль</p>
            <div className="profile-block-content-data-item-value">
              {editModeAccount ? (
                <button
                  onClick={handlePasswordChange}
                  className="profile-block-content-data-btn-change-password"
                >
                  Изменить пароль
                </button>
              ) : (
                <p>*******</p>
              )}
            </div>
          </div>
          {/*<div className="profile-block-content-data-profile-column-i">
            <p className="profile-block-content-data-item-text">Статус</p>
            <div className="profile-block-content-data-item-value">
              {editModeAccount ? (
                <input
                  className="profile-input"
                  type="text"
                  value={tempUser.status || ''}
                  onChange={(event) => handleInputChange(event, 'status')}
                  placeholder="Введите статус"
                  maxLength={120}
                />
              ) : (
                <p>{tempUser.status || '-'}</p>
              )}
            </div>
          </div>*/}
        </div>
      </div>
      {editModeAccount && (
        <div className="profile-block-content-data-btn">
          <button
            onClick={handleCancelClickAccount}
            className="profile-block-content-data-btn-cancel"
          >
            Отменить
          </button>
          <button
            onClick={(event) => {
              event.preventDefault()
              handleSaveClick()
            }}
            type="submit"
            className="profile-block-content-data-btn-save"
          >
            Сохранить
          </button>
        </div>
      )}
    </div>
  )
}

export default AccountSection
