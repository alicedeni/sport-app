import React, { useState } from 'react'
import { authService } from '@shared/services/authService'

const PasswordChangeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Введите старый пароль'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Введите новый пароль'
    } else if (formData.newPassword.length < 4) {
      newErrors.newPassword = 'Пароль должен содержать минимум 4 символа'
    } else if (formData.newPassword === formData.oldPassword) {
      newErrors.newPassword = 'Новый пароль не должен совпадать со старым'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите новый пароль'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    setSaving(true)
    try {
      const payload = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }
      const res = await authService.changePassword(payload)
      if (res.data?.status === 200) {
        setSuccess(true)
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
        setErrors({})
      } else {
        setErrors((prev) => ({
          ...prev,
          oldPassword: 'Неверный пароль',
          general: '',
        }))
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, oldPassword: 'Неверный пароль', general: '' }))
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="password-modal-overlay">
      <div className="password-modal">
        {!success ? (
          <>
            <div className="password-modal-header">
              <h2 className="password-modal-title">Изменение пароля</h2>
            </div>
            <form onSubmit={handleSubmit} className="password-modal-form">
              {errors.general && <div className="password-modal-error">{errors.general}</div>}
              <div className="password-modal-fields">
                <div className="password-modal-field">
                  <label className="password-modal-label">Старый пароль</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    className={`password-modal-input ${errors.oldPassword ? 'error' : ''}`}
                    autoComplete="current-password"
                  />
                  {errors.oldPassword && (
                    <span className="password-modal-field-error">{errors.oldPassword}</span>
                  )}
                </div>
                <div className="password-modal-field">
                  <label className="password-modal-label">Новый пароль</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`password-modal-input ${errors.newPassword ? 'error' : ''}`}
                    autoComplete="new-password"
                  />
                  {errors.newPassword && (
                    <span className="password-modal-field-error">{errors.newPassword}</span>
                  )}
                </div>
                <div className="password-modal-field">
                  <label className="password-modal-label">Подтверждение пароля</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`password-modal-input ${errors.confirmPassword ? 'error' : ''}`}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <span className="password-modal-field-error">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>
              <div className="password-modal-buttons">
                <button
                  type="button"
                  onClick={handleClose}
                  className="password-modal-btn password-modal-btn-cancel"
                >
                  Отменить
                </button>
                <button
                  type="submit"
                  className="password-modal-btn password-modal-btn-save"
                  disabled={saving}
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="password-modal-success">
            <div className="password-modal-header">
              <h2 className="password-modal-title">Готово</h2>
            </div>
            <div
              className="password-modal-body"
              style={{ fontSize: 20, padding: 10, textAlign: 'center' }}
            >
              Пароль успешно изменен
            </div>
            <div className="password-modal-buttons" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="password-modal-btn password-modal-btn-save"
                onClick={handleClose}
              >
                Ок
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PasswordChangeModal
