import api from '@shared/services/api.js'
import { API_ENDPOINTS } from '@constants/api.js'
import logger from '@shared/utils/logger'

export const challengeService = {
  getChallenges: (params = {}) => api.get(API_ENDPOINTS.CHALLENGES, { params }),

  getChallenge: (id) => api.get(`${API_ENDPOINTS.CHALLENGES}/${id}`),

  joinChallenge: (id) => api.post(`${API_ENDPOINTS.CHALLENGES}/${id}/join`),

  leaveChallenge: (id) => api.post(`${API_ENDPOINTS.CHALLENGES}/${id}/leave`),

  getLeaderboard: (id, params = {}) =>
    api.get(`${API_ENDPOINTS.CHALLENGES}/${id}/leaderboard`, { params }),

  getTeamLeaderboard: (id, params = {}) =>
    api.get(`${API_ENDPOINTS.CHALLENGES}/${id}/team-leaderboard`, { params }),

  getMyChallenges: (params = {}) => api.get('/my-challenges', { params }),

  participateInChallenge: (id) => api.post(`${API_ENDPOINTS.CHALLENGES}/${id}/join`),

  getChallengeProgress: (id) => api.get(`${API_ENDPOINTS.CHALLENGES}/${id}`),

  updateChallengeProgress: (id, data) => {
    logger.warn(
      'updateChallengeProgress is deprecated. Progress updates automatically on activity creation.',
    )
    return Promise.reject(new Error('Progress updates automatically'))
  },
}
