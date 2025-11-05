import api from '@shared/services/api.js'
import { API_ENDPOINTS } from '@constants/api.js'

export const authService = {
  register: (data) => api.post(API_ENDPOINTS.REGISTER, data, { useBearerToken: false }),

  login: (data) => api.post(API_ENDPOINTS.LOGIN, data, { useBearerToken: false }),

  logout: () => api.post(API_ENDPOINTS.LOGOUT, {}, { useBearerToken: false }),

  refreshToken: () => api.post(API_ENDPOINTS.REFRESH_TOKEN, {}, { useBearerToken: false }),

  forgotPassword: (email) => api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email }, { useBearerToken: false }),

  resetPassword: (data) => api.post(API_ENDPOINTS.RESET_PASSWORD, data, { useBearerToken: false }),

  changePassword: (data) => api.post(API_ENDPOINTS.CHANGE_PASSWORD, data),

  verifyToken: () => api.get(API_ENDPOINTS.VERIFY_TOKEN),
}
