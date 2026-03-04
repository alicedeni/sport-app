import api from '@shared/services/api.js'

export const adminService = {
  getUsers: (params = {}) => {
    return api.get('/admin/users', { params })
  },

  getUserById: (id) => {
    return api.get(`/admin/users/${id}`)
  },

  createUser: (userData) => {
    return api.post('/admin/users', userData)
  },

  updateUser: (id, userData) => {
    return api.patch(`/admin/users/${id}`, userData)
  },

  updateUserStatus: (id, statusData) => {
    return api.patch(`/admin/users/${id}/status`, statusData)
  },

  updateUserRole: (id, role) => {
    return api.patch(`/admin/users/${id}/role`, { role })
  },

  deleteUser: (id) => {
    return api.delete(`/admin/users/${id}`)
  },

  resetPassword: (id) => {
    return api.post(`/admin/users/${id}/reset-password`)
  },

  getAuditLogs: (params = {}) => {
    return api.get('/admin/audit/users', { params })
  },

  getStatsOverview: (params = {}) => {
    return api.get('/admin/stats/overview', { params })
  },

  getParticipantsRating: (params = {}) => {
    return api.get('/admin/stats/participants-rating', { params })
  },

  getErrors: (params = {}) => {
    return api.get('/admin/errors', { params })
  },

  getLogs: (params = {}) => {
    return api.get('/admin/logs', { params })
  },

  getSettings: () => {
    return api.get('/admin/settings')
  },

  updateSettings: (settings) => {
    return api.patch('/admin/settings', settings)
  },

  getFeatureFlags: () => {
    return api.get('/admin/feature-flags')
  },

  updateFeatureFlags: (flags) => {
    return api.patch('/admin/feature-flags', { flags })
  },

  getDashboardRecentActivity: (params = {}) => {
    return api.get('/admin/dashboard/recent-activity', { params })
  },

  getDashboardQuickActions: () => {
    return api.get('/admin/dashboard/quick-actions')
  },

  getChallenges: (params = {}) => {
    return api.get('/admin/challenges', { params })
  },

  getChallengeById: (id) => {
    return api.get(`/admin/challenges/${id}`)
  },

  createChallenge: (challengeData) => {
    return api.post('/admin/challenges', challengeData)
  },

  updateChallenge: (id, challengeData) => {
    return api.patch(`/admin/challenges/${id}`, challengeData)
  },

  updateChallengeStatus: (id, status) => {
    return api.patch(`/admin/challenges/${id}/status`, { status })
  },

  deleteChallenge: (id) => {
    return api.delete(`/admin/challenges/${id}`)
  },

  getChallengeParticipants: (id, params = {}) => {
    return api.get(`/admin/challenges/${id}/participants`, { params })
  },

  rewardChallengeParticipant: (challengeId, participantId) => {
    return api.post(`/admin/challenges/${challengeId}/participants/${participantId}/reward`)
  },

  getTasks: (params = {}) => {
    return api.get('/admin/tasks', { params })
  },

  createTask: (taskData) => {
    return api.post('/admin/tasks', taskData)
  },

  updateTask: (id, taskData) => {
    return api.patch(`/admin/tasks/${id}`, taskData)
  },

  deleteTask: (id) => {
    return api.delete(`/admin/tasks/${id}`)
  },

  getPosts: (params = {}) => {
    return api.get('/admin/posts', { params })
  },

  updatePostStatus: (id, status) => {
    return api.patch(`/admin/posts/${id}/status`, { status })
  },

  updatePost: (id, data) => {
    return api.put(`/admin/posts/${id}`, data)
  },

  deletePost: (id) => {
    return api.delete(`/admin/posts/${id}`)
  },

  getComments: (params = {}) => {
    return api.get('/admin/comments', { params })
  },

  updateCommentStatus: (id, status) => {
    return api.patch(`/admin/comments/${id}/status`, { status })
  },

  deleteComment: (id) => {
    return api.delete(`/admin/comments/${id}`)
  },

  getTeamsRating: (params = {}) => {
    return api.get('/admin/stats/teams-rating', { params })
  },

  getMetrics: (params = {}) => {
    return api.get('/admin/stats/metrics', { params })
  },

  recalculateStats: (data) => {
    return api.post('/admin/stats/recalculate', data)
  },

  exportStats: (params = {}) => {
    return api.get('/admin/stats/export', { params, responseType: 'blob' })
  },

  recalculateLeagues: () => {
    return api.post('/admin/leagues/recalculate')
  },

  getTeams: (params = {}) => {
    return api.get('/admin/teams', { params })
  },

  createTeam: (teamData) => {
    return api.post('/admin/teams', teamData)
  },

  renameTeam: (teamId, name) => {
    return api.patch(`/admin/teams/${teamId}`, { name })
  },

  deleteTeam: (teamId) => {
    return api.delete(`/admin/teams/${teamId}`)
  },

  addUserToTeam: (teamId, userId) => {
    return api.post(`/admin/teams/${teamId}/users`, { user_id: userId })
  },

  removeUserFromTeam: (teamId, userId) => {
    return api.delete(`/admin/teams/${teamId}/users/${userId}`)
  },

  getTeamUsers: (teamId, params = {}) => {
    return api.get(`/admin/teams/${teamId}/users`, { params })
  },

  getErrorById: (id) => {
    return api.get(`/admin/errors/${id}`)
  },

  updateErrorStatus: (id, status) => {
    return api.patch(`/admin/errors/${id}/status`, { status })
  },

  ingestError: (errorData) => {
    return api.post('/admin/errors/ingest', errorData)
  },
}
