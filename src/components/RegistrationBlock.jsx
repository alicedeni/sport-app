import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonEnter, ButtonToEnter, ButtonNext } from '@components/Buttons.jsx'
import { authService } from '@shared/services/authService'
import logger from '@shared/utils/logger'

const RegistrationBlock = () => {
  const navigate = useNavigate()
  const [formState, setFormState] = useState('registration')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_check, setPasswordCheck] = useState('')
  const [surname, setSurname] = useState('')
  const [name, setName] = useState('')
  const [patronymic, setPatronymic] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    if (email.trim() === '' || password.trim() === '') {
      setError('Пожалуйста, введите email и пароль.')
      return
    }
    if (!validateEmail(email)) {
      setError('Пожалуйста, введите корректный email.')
      return
    }
    setError('')
    try {
      const response = await authService.register({ name, surname, patronymic, email, password })
      if (response.data.status === 200) {
        const token = response.data.token
        if (token) {
          localStorage.setItem('token', token)
        }
        navigate('/', { replace: true })
      } else {
        setError('Ошибка регистрации')
      }
    } catch (error) {
      logger.error(error)
      setError('Заполните все поля')
    }
  }

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const handleFormChange = () => {
    if ('registration' && surname && name && patronymic) {
      setFormState('registration2')
    } else {
      setFormState('registration')
    }
  }

  const handleSurnameChange = (e) => {
    setSurname(e.target.value)
    const isButtonEnabled = surname && name && patronymic
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
    const isButtonEnabled = surname && name && patronymic
  }

  const handlePatronymicChange = (e) => {
    setPatronymic(e.target.value)
    const isButtonEnabled = surname && name && patronymic
  }

  const isFormReg = formState === 'registration2'
  const isButtonEnabled = surname && name && patronymic

  return (
    <div className="welcome-block">
      <h1 className="welcome-block__text">Добро пожаловать!</h1>
      <form onSubmit={handleLogin}>
        {isFormReg ? (
          <>
            <input
              className="welcome-block__input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className="welcome-block__input"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <input
              className="welcome-block__input"
              type="password"
              placeholder="Повторите пароль"
              value={password_check}
              onChange={(e) => setPasswordCheck(e.target.value)}
              required
              autoComplete="new-password"
            />
            <div className="welcome-block__error">
              {error && <p className="error error-text">{error}</p>}
            </div>
            <ButtonEnter
              className="welcome-block__btn"
              text="Зарегистрироваться"
              type="submit"
              textContent={'Зарегистрироваться'}
            ></ButtonEnter>
          </>
        ) : (
          <>
            <input
              className="welcome-block__input"
              type="text"
              placeholder="Фамилия"
              value={surname}
              onChange={handleSurnameChange}
              required
              autoComplete="family-name"
            />
            <input
              className="welcome-block__input"
              type="text"
              placeholder="Имя"
              value={name}
              onChange={handleNameChange}
              required
              autoComplete="given-name"
            />
            <input
              className="welcome-block__input"
              type="text"
              placeholder="Отчество"
              value={patronymic}
              onChange={handlePatronymicChange}
              required
              autoComplete="additional-name"
            />
            <div className="welcome-block__error">
              {error && <p className="error error-text">{error}</p>}
            </div>
            <ButtonNext
              className="welcome-block__btn"
              text="Далее"
              onClick={handleFormChange}
              type="button"
              disabled={!surname || !name || !patronymic}
              textContent={'Далее'}
            ></ButtonNext>
          </>
        )}
      </form>
      <ButtonToEnter
        className="welcome-block__btn"
        text="Войти"
        textContent={'Войти'}
      ></ButtonToEnter>
    </div>
  )
}

export default RegistrationBlock
