import api from '@shared/services/api.js'
import { API_ENDPOINTS } from '@constants/api.js'

export const authService = {
  register: (data) => api.post(API_ENDPOINTS.REGISTER, data),

  login: (data) => api.post(API_ENDPOINTS.LOGIN, data),

  logout: () => api.post(API_ENDPOINTS.LOGOUT),

  refreshToken: () => api.post(API_ENDPOINTS.REFRESH_TOKEN),

  forgotPassword: (email) => api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email }),

  resetPassword: (data) => api.post(API_ENDPOINTS.RESET_PASSWORD, data),

  changePassword: (data) => api.post(API_ENDPOINTS.CHANGE_PASSWORD, data),

  verifyToken: () => api.get(API_ENDPOINTS.VERIFY_TOKEN),
}
