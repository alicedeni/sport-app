export interface User {
  id: string
  name: string
  avatar?: string
  points: number
  goal: number
  teams: number
  participants: number
  count: number
  showWelcome: boolean
}

export interface Post {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  image?: string
  activityType: ActivityType
  duration: number
  distance?: number
  createdAt: string
  likes: number
  comments: Comment[]
  isLiked: boolean
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  points: number
  progress: number
  maxProgress: number
  isCompleted: boolean
  isParticipating: boolean
  deadline: string
}

export interface Activity {
  id: string
  type: ActivityType
  duration: number
  distance?: number
  calories?: number
  date: string
  userId: string
}

export type ActivityType =
  | 'pool'
  | 'cardio'
  | 'run'
  | 'power'
  | 'bike'
  | 'yoga'
  | 'walk'
  | 'game'
  | 'dance'
  | 'other'

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface FilterParams {
  activityType?: ActivityType
  dateFrom?: string
  dateTo?: string
  search?: string
}

