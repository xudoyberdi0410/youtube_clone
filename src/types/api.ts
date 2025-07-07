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
  channel_name: string
  description: string
  user_id: number
  created_at: string
  updated_at?: string
  profile_image_url?: string
  banner_image_url?: string
  // Альтернативные поля, которые приходят от API
  profile_image?: string
  banner_image?: string
  profile_picture?: string // Добавляем для аватара
  subscribers_count?: number
  subscription_amount?: number // Добавляем поле, которое приходит от API
  is_verified?: boolean // Добавляем для значка верификации
  // @deprecated
  name?: string // @deprecated использовать channel_name
}

export interface Video {
  id: number
  // Обновленные поля по новому API
  channel_name: string // было name
  profile_image: string | null
  video_title: string // было title
  video_description: string // было description
  file_path: string
  thumbnail_path: string
  category: VideoCategory
  video_views: number // было views
  created_at: string // формат: "2025-07-03T15:30:00"
  like_amount: number
  dislike_amount?: number // новое поле
  duration?: number
  duration_video?: string // новое поле в формате "02:00"
  
  // Оставляем старые поля для совместимости
  name?: string // @deprecated использовать channel_name
  title?: string // @deprecated использовать video_title
  description?: string // @deprecated использовать video_description
  views?: number // @deprecated использовать video_views
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
  username: string
  channel_name: string
  title: string
  file_path: string
  thumbnail_path: string
  views: number
  watched_at: string
}

export interface Playlist {
  id: number
  name: string
  description: string
  user_id: number
  is_public: boolean
  is_personal?: boolean
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

// Новый тип для ответа API подписок
export interface SubscriptionResponse {
  id: number
  name: string
  profile_image: string
  subscription_amount: number
  username: string
  created_at: string
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
  channel_name: string
  description: string
}

export interface ChannelUpdate {
  channel_name: string
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
  is_personal: boolean
}

export interface PlaylistUpdate {
  name: string
  description: string
  is_personal?: boolean
}

export interface PlaylistVideoCreate {
  playlist_id: number
  video_id: number
}

export interface SubscriptionCreate {
  channel_id: number
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
