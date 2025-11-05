export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000'

export const API_ENDPOINTS = {
  PROFILE: '/profile',
  MAIN: '/main',
  PARTICIPANTS_RATING: '/participants-rating',
  TEAMS_RATING: '/teams-rating',
  POSTS: '/posts',
  LIKE: '/user/like',
  UNLIKE: '/user/unlike',
  COMMENTS: '/get_comments',
  ADD_COMMENT: '/user/add_comment',
  DELETE_COMMENT: '/user/delete_comment',
  ACTIVITIES: '/activities',
  CHALLENGES: '/challenges',
  UPLOAD: '/upload',
  CHANGE_PASSWORD: '/password/change',
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_TOKEN: '/auth/verify',
  HIDE_WELCOME: '/hide_welcome',
}
