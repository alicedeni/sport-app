import axios from 'axios'
import { API_BASE_URL } from '@constants/api.js'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    if (error.response?.status === 403) {
      const isAdminRoute =
        error.config?.url?.includes('/admin') || window.location.pathname.includes('/admin')
      if (isAdminRoute) {
        window.location.href = '/main'
      }
    }
    return Promise.reject(error)
  },
)

export default api
