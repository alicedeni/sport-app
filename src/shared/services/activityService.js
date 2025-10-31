import api from '@shared/services/api.js'
import { API_ENDPOINTS } from '@constants/api.js'

export const activityService = {
  getActivities: (params = {}) => api.get(API_ENDPOINTS.ACTIVITIES, { params }),

  getActivity: (id) => api.get(`${API_ENDPOINTS.ACTIVITIES}/${id}`),

  createActivity: (data) => api.post(API_ENDPOINTS.ACTIVITIES, data),

  updateActivity: (id, data) => api.put(`${API_ENDPOINTS.ACTIVITIES}/${id}`, data),

  deleteActivity: (id) => api.delete(`${API_ENDPOINTS.ACTIVITIES}/${id}`),

  getActivityStats: (params = {}) => api.get(`${API_ENDPOINTS.ACTIVITIES}/stats`, { params }),

  getActivitiesByType: (type, params = {}) =>
    api.get(`${API_ENDPOINTS.ACTIVITIES}/type/${type}`, { params }),
}
