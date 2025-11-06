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
let refreshAttempts = 0
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

    if (error.response?.status === 401) {
      const url = originalRequest?.url || ''
      if (url.includes('/auth/refresh') || originalRequest?._retry === true) {
        try {
          const current = window.location.pathname + window.location.search + window.location.hash
          sessionStorage.setItem('intended_path', current)
        } catch {}
        localStorage.removeItem('token')
        window.location.replace('/')
        return Promise.reject(error)
      }
    }

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
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

        const attemptRefresh = async () => {
          return await api.post('/auth/refresh', {}, { useBearerToken: false })
        }

        let refreshResponse = await attemptRefresh()

        if (refreshResponse.data.status === 200) {
          const newToken = refreshResponse.data.token
          if (newToken) {
            localStorage.setItem('token', newToken)
          }
          processQueue(null, newToken)
          isRefreshing = false
          refreshAttempts = 0
          return api(originalRequest)
        } else if (refreshResponse.data.status === 401 || refreshResponse.status === 401) {
          throw new Error('Refresh unauthorized')
        } else {
          if (refreshAttempts < 1) {
            refreshAttempts += 1
            await sleep(300)
            refreshResponse = await attemptRefresh()
            if (refreshResponse.data.status === 200) {
              const newToken = refreshResponse.data.token
              if (newToken) {
                localStorage.setItem('token', newToken)
              }
              processQueue(null, newToken)
              isRefreshing = false
              refreshAttempts = 0
              return api(originalRequest)
            }
          }
          throw new Error('Refresh failed')
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false
        refreshAttempts = 0
        if (typeof navigator !== 'undefined' && navigator && navigator.onLine === false) {
          return Promise.reject(refreshError)
        }
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
