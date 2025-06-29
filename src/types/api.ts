// API Response Types
export interface User {
  id: number
  username: string
  email: string
  created_at: string
  updated_at?: string
  avatar_url?: string
}

export interface Channel {
  id: number
  name: string
  description: string
  user_id: number
  created_at: string
  updated_at?: string
  profile_image_url?: string
  banner_image_url?: string
  subscribers_count?: number
}

export interface Video {
  id: number
  name: string
  profile_image: string | null
  title: string
  description: string
  file_path: string
  thumbnail_path: string
  category: VideoCategory
  views: number
  created_at: string
  like_amount: number
  duration?: number
}

export interface Like {
  id: number
  user_id: number
  video_id: number
  is_like: boolean
  created_at: string
}

export interface Comment {
  id: number
  user_id: number
  video_id: number
  comment: string
  created_at: string
  updated_at?: string
  user?: User
}

export interface History {
  id: number
  user_id: number
  video_id: number
  watched_at: string
  video?: Video
}

export interface Playlist {
  id: number
  name: string
  description: string
  user_id: number
  is_public: boolean
  created_at: string
  updated_at?: string
  videos_count?: number
}

export interface PlaylistVideo {
  id: number
  playlist_id: number
  video_id: number
  added_at: string
  video?: Video
}

export interface Subscription {
  id: number
  subscriber_id: number
  channel_id: number
  created_at: string
  channel?: Channel
}

export interface Shorts {
  id: number
  title: string
  description: string
  category: VideoCategory
  channel_id: number
  video_url: string
  thumbnail_url?: string
  views_count: number
  likes_count: number
  dislikes_count: number
  created_at: string
  channel?: Channel
}

export type VideoCategory = 
  | 'Musiqa' 
  | "Ta'lim" 
  | 'Texnologiya' 
  | "O'yinlar" 
  | 'Yangiliklar' 
  | "Ko'ngilochar" 
  | 'Sport' 
  | 'Ilm-fan va Tabiat' 
  | 'Sayohat' 
  | 'Oshxona va Pazandachilik' 
  | "Moda va Go'zallik" 
  | 'Biznes' 
  | 'Motivatsiya' 
  | 'Filmlar' 
  | 'Seriallar' 
  | 'Avtomobillar' 
  | 'Hayvonlar' 
  | 'Siyosat'

// API Request Types
export interface LoginCredentials {
  username: string
  password: string
}

export interface UserRegistration {
  username: string
  email: string
  password: string
}

export interface UserUpdate {
  username: string
  email: string
  password: string
}

export interface ChannelCreate {
  name: string
  description: string
}

export interface ChannelUpdate {
  name: string
  description: string
}

export interface VideoUpload {
  title: string
  description: string
  category: VideoCategory
}

export interface VideoUpdate {
  title: string
  description: string
  category: VideoCategory
}

export interface LikeCreate {
  video_id: number
  is_like: boolean
}

export interface CommentCreate {
  video_id: number
  comment: string
}

export interface CommentUpdate {
  video_id: number
  comment: string
}

export interface HistoryCreate {
  video_id: number
}

export interface PlaylistCreate {
  name: string
  description: string
}

export interface PlaylistUpdate {
  name: string
  description: string
}

export interface PlaylistVideoCreate {
  playlist_id: number
  video_id: number
}

export interface SubscriptionCreate {
  channel_id: number
}

export interface ShortsUpload {
  title: string
  description: string
  category: VideoCategory
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in?: number
}

// API Error Types
export interface ApiErrorResponse {
  detail: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}

export interface ValidationError {
  detail: string
  field?: string
}

// Pagination Types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

// API Configuration
export interface ApiConfig {
  baseUrl: string
  timeout?: number
  headers?: Record<string, string>
}

// Upload Progress
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}
