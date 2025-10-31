import api from '@shared/services/api.js'
import { API_ENDPOINTS } from '@constants/api.js'

export const challengeService = {
  getChallenges: (params = {}) => api.get(API_ENDPOINTS.CHALLENGES, { params }),

  getChallenge: (id) => api.get(`${API_ENDPOINTS.CHALLENGES}/${id}`),

  participateInChallenge: (id) => api.post(`${API_ENDPOINTS.CHALLENGES}/${id}/participate`),

  leaveChallenge: (id) => api.delete(`${API_ENDPOINTS.CHALLENGES}/${id}/participate`),

  getChallengeProgress: (id) => api.get(`${API_ENDPOINTS.CHALLENGES}/${id}/progress`),

  updateChallengeProgress: (id, data) =>
    api.put(`${API_ENDPOINTS.CHALLENGES}/${id}/progress`, data),
}
