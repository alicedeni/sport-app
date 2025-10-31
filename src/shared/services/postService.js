import api from '@shared/services/api.js'
import { API_ENDPOINTS } from '@constants/api.js'

export const postService = {
  getPosts: (params = {}) => api.get(API_ENDPOINTS.POSTS, { params }),

  getPost: (id) => api.get(`${API_ENDPOINTS.POSTS}/${id}`),

  createPost: (data) => api.post(API_ENDPOINTS.POSTS, data),

  updatePost: (id, data) => api.put(`${API_ENDPOINTS.POSTS}/${id}`, data),

  deletePost: (id) => api.delete(`${API_ENDPOINTS.POSTS}/${id}`),

  likePost: (id) => api.post('/user/like', { post_id: id }),

  unlikePost: (id) => api.post('/user/unlike', { post_id: id }),

  getComments: (postId) => api.get(`/get_comments/${postId}`),

  addComment: (postId, data) => api.post('/user/comment', { post_id: postId, ...data }),

  deleteComment: (postId, commentId) => api.delete(`/user/delete_comment/${commentId}`),

  likeComment: (commentId) => api.post(`/user/comment/${commentId}/like`, { comment_id: commentId }),

  unlikeComment: (commentId) => api.post(`/user/comment/${commentId}/unlike`, { comment_id: commentId }),
}
