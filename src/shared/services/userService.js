import api from '@shared/services/api.js'
import { API_ENDPOINTS } from '@constants/api.js'

export const userService = {
  getMainInfo: () => api.get('/profile'),
  getMainData: () => api.get('/main'),
  hideWelcome: () => api.post(API_ENDPOINTS.HIDE_WELCOME),
}
