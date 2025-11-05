import axios from 'axios'
import { API_BASE_URL } from '@constants/api.js'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.request.use((config) => {
  if (config.useBearerToken === true) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await api.post('/auth/refresh', {}, { useBearerToken: false })
        if (refreshResponse.data.status === 200) {
          const newToken = refreshResponse.data.token
          if (newToken) {
            localStorage.setItem('token', newToken)
          }
          processQueue(null, newToken)
          isRefreshing = false
          return api(originalRequest)
        } else {
          throw new Error('Refresh failed')
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false
        try {
          const current = window.location.pathname + window.location.search + window.location.hash
          sessionStorage.setItem('intended_path', current)
        } catch {}
        localStorage.removeItem('token')
        window.location.replace('/')
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.status === 403) {
      const isAdminRoute =
        error.config?.url?.includes('/admin') || window.location.pathname.includes('/admin')
      if (isAdminRoute) {
        window.location.replace('/main')
      }
    }
    return Promise.reject(error)
  },
)

export default api
