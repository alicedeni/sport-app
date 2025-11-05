import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonEnter, ButtonReg } from '@components/Buttons.jsx'
import { authService } from '@shared/services/authService'
import api from '@shared/services/api'
import logger from '@shared/utils/logger'

const WelcomeBlock = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    if (email.trim() === '' || password.trim() === '') {
      setError('Пожалуйста, введите логин и пароль.')
      return
    }
    setError('')
    try {
      const response = await authService.login({ email, password })
      if (response.data.status === 200) {
        const token = response.data.token
        if (token) {
          localStorage.setItem('token', token)
        }
        await checkHelloStatus()
      } else {
        setError('Введен неверный логин или пароль.')
      }
    } catch (error) {
      logger.error('Ошибка при входе:', error)
      if (error.response?.status === 401 || error.response?.status === 400) {
        setError('Введен неверный логин или пароль.')
      } else {
        setError('Произошла ошибка при входе.')
      }
    }
  }

  const checkHelloStatus = async () => {
    try {
      const response = await api.get('/user/get_hello_status')
      const fHello = response.data?.f_hello ?? response.data?.data?.f_hello
      const isFirstTime = fHello === false || fHello === 0 || fHello === 'false'
      if (isFirstTime) {
        try {
          const updateResponse = await api.post('/user/update_f_hello', {})
          navigate('/about', { replace: true })
        } catch (error) {
          logger.error('Error updating f_hello', error)
          setError('Произошла ошибка при обновлении статуса.')
          navigate('/about', { replace: true })
        }
      } else {
        navigate('/main', { replace: true })
      }
    } catch (error) {
      logger.error('Error checking hello status', error)
      setError('Произошла ошибка при проверке статуса.')
      navigate('/main', { replace: true })
    }
  }

  return (
    <div className="welcome-block">
      <h1 className="welcome-block__text">Добро пожаловать!</h1>
      <form onSubmit={handleLogin}>
        <input
          className="welcome-block__input"
          type="text"
          placeholder="Логин"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <input
          className="welcome-block__input"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <div className="welcome-block__error">
          {error && <p className="error error-text">{error}</p>}
        </div>
        <ButtonEnter
          className="welcome-block__btn"
          text="Войти"
          textContent={'Войти'}
        ></ButtonEnter>
      </form>
      <ButtonReg
        className="welcome-block__btn"
        text="Зарегистрироваться"
        textContent={'Зарегистрироваться'}
      ></ButtonReg>
    </div>
  )
}

export default WelcomeBlock
