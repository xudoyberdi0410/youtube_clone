import { buildApiUrl, getAuthHeaders } from './api-config'
import type {
  User,
  Channel,
  Video,
  Like,
  Comment,
  History,
  Playlist,
  PlaylistVideo,
  Subscription,
  SubscriptionResponse,
  Shorts,
  VideoCategory,
  LoginCredentials,
  UserRegistration,
  UserUpdate,
  ChannelCreate,
  ChannelUpdate,
  VideoUpload,
  VideoUpdate,
  LikeCreate,
  CommentCreate,
  CommentUpdate,
  HistoryCreate,
  PlaylistCreate,
  PlaylistUpdate,
  PlaylistVideoCreate,
  SubscriptionCreate
} from '../types/api'
import type { VideoComment } from '../types/common'
import type { TokenResponse } from '../types/auth'

// Типы для API ответов
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  success?: boolean
}

export class ApiError extends Error {
  status?: number
  details?: unknown

  constructor(message: string, status?: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

// Основной класс для работы с API
export class ApiClient {
  private static instance: ApiClient
  
  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  // Попытка обновить токен
  private async tryRefreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token') || localStorage.getItem('refreshToken')
      if (!refreshToken) {
        console.log('No refresh token available')
        return false
      }

      console.log('Attempting to refresh token...')
      const response = await this.refreshTokenRequest(refreshToken)
      
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token)
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token)
        }
        
        // Уведомляем об изменении состояния
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('authStateChanged'))
        }
        
        console.log('Token refreshed successfully')
        return true
      }
      
      return false
    } catch (error) {
      console.error('Failed to refresh token:', error)
      
      // Используем умную очистку токенов
      const { clearTokensOnCriticalError } = await import('../modules/auth/lib/auth-utils')
      clearTokensOnCriticalError(error)
      
      return false
    }
  }

  // Прямой запрос на обновление токена (без интерцептора)
  private async refreshTokenRequest(refreshToken: string): Promise<TokenResponse> {
    const url = buildApiUrl('/login/refresh_token')
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<T> {
    const url = buildApiUrl(endpoint)
    const headers = getAuthHeaders()
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        // Если получили 401 ошибку и это не повторный запрос
        if (response.status === 401 && !isRetry) {
          console.log('Received 401 error, attempting token refresh...')
          
          // Пытаемся обновить токен
          const tokenRefreshed = await this.tryRefreshToken()
          if (tokenRefreshed) {
            console.log('Token refreshed, retrying original request...')
            // Повторяем запрос с новым токеном, обновляя заголовки
            const newHeaders = getAuthHeaders()
            const retryConfig = {
              ...options,
              headers: {
                ...newHeaders,
                ...options.headers,
              },
            }
            return this.request<T>(endpoint, retryConfig, true)
          } else {
            console.log('Token refresh failed')
          }
        }
        
        const errorData = await response.json().catch(() => ({}))
        const apiError = new ApiError(
          errorData.detail || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        )
        
        // Если это 401 и мы не смогли обновить токен, используем умную очистку
        if (response.status === 401) {
          const { clearTokensOnCriticalError } = await import('../modules/auth/lib/auth-utils')
          clearTokensOnCriticalError(apiError)
        }
        
        throw apiError
      }

      // Пытаемся получить JSON напрямую
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        return await response.json()
      }
      
      // Если не JSON, читаем как текст
      const text = await response.text()
      if (!text) return {} as T
      
      try {
        return JSON.parse(text)
      } catch {
        // Если не удалось распарсить как JSON, возвращаем как есть
        return text as T
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Проверяем, является ли ошибка AbortError
      if (error instanceof Error && error.name === 'AbortError') {
        throw error
      }
      
      console.error('API Request failed:', error)
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error'
      )
    }
  }

  // GET запрос
  async get<T>(endpoint: string, params?: Record<string, string | number>, signal?: AbortSignal): Promise<T> {
    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })
      url += `?${searchParams.toString()}`
    }
    return this.request<T>(url, { method: 'GET', signal })
  }

  // POST запрос
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT запрос
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE запрос
  async delete<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })
      url += `?${searchParams.toString()}`
    }
    return this.request<T>(url, { method: 'DELETE' })
  }

  // POST запрос с FormData (для загрузки файлов)
  async postFormData<T>(endpoint: string, formData: FormData, isRetry: boolean = false): Promise<T> {
    const url = buildApiUrl(endpoint)
    const token = getAuthHeaders().Authorization

    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = token
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        // Если получили 401 ошибку и это не повторный запрос
        if (response.status === 401 && !isRetry) {
          const tokenRefreshed = await this.tryRefreshToken()
          if (tokenRefreshed) {
            return this.postFormData<T>(endpoint, formData, true)
          }
        }
        
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.detail || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        )
      }

      const text = await response.text()
      if (!text) return {} as T
      
      return JSON.parse(text)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      console.error('API FormData Request failed:', error)
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error'
      )
    }
  }

  // PUT запрос с FormData (для обновления файлов)
  async putFormData<T>(endpoint: string, formData: FormData, isRetry: boolean = false): Promise<T> {
    const url = buildApiUrl(endpoint)
    const token = getAuthHeaders().Authorization

    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = token
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: formData,
      })

      if (!response.ok) {
        // Если получили 401 ошибку и это не повторный запрос
        if (response.status === 401 && !isRetry) {
          const tokenRefreshed = await this.tryRefreshToken()
          if (tokenRefreshed) {
            return this.putFormData<T>(endpoint, formData, true)
          }
        }
        
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.detail || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        )
      }

      const text = await response.text()
      if (!text) return {} as T
      
      return JSON.parse(text)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      console.error('API FormData Request failed:', error)
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error'
      )
    }
  }

  // POST запрос с form-urlencoded (для логина)
  async postFormUrlencoded<T>(endpoint: string, data: Record<string, string>): Promise<T> {
    const url = buildApiUrl(endpoint)
    
    const formData = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })

      if (!response.ok) {
        // Для логина не делаем retry, так как это и есть получение токена
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.detail || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        )
      }

      const text = await response.text()
      if (!text) return {} as T
      
      return JSON.parse(text)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      console.error('API FormUrlencoded Request failed:', error)
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error'
      )
    }
  }
  // === USER ENDPOINTS ===

  // Регистрация пользователя
  async registerUser(userData: UserRegistration): Promise<User> {
    return this.post<User>('/user/post_user', userData)
  }

  // Загрузка аватара пользователя
  async uploadUserAvatar(imageFile: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', imageFile)
    return this.postFormData<string>('/user/post_image', formData)
  }

  // Получение данных пользователя
  async getUser(): Promise<User> {
    return this.get<User>('/user/get_user')
  }

  // Обновление данных пользователя
  async updateUser(userData: UserUpdate): Promise<User> {
    return this.put<User>('/user/put_user', userData)
  }

  // Обновление аватара пользователя
  async updateUserAvatar(imageFile: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', imageFile)
    return this.putFormData<string>('/user/put_image', formData)
  }

  // Удаление пользователя
  async deleteUser(): Promise<string> {
    return this.delete<string>('/user/delete_user')
  }

  // === CHANNEL ENDPOINTS ===

  // Создание канала
  async createChannel(channelData: ChannelCreate): Promise<Channel> {
    return this.post<Channel>('/channel/post_channel', channelData)
  }

  // Загрузка изображения профиля канала
  async uploadChannelProfileImage(imageFile: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', imageFile)
    return this.postFormData<string>('/channel/post_profile_image', formData)
  }

  // Загрузка баннера канала
  async uploadChannelBannerImage(imageFile: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', imageFile)
    return this.postFormData<string>('/channel/post_banner_image', formData)
  }

  // Получение моего канала
  async getMyChannel(): Promise<Channel> {
    return this.get<Channel>('/channel/my_channel')
  }

  // Получение всех моих каналов (для будущего расширения API)
  async getMyChannels(): Promise<Channel[]> {
    try {
      // Пока API поддерживает только один канал, возвращаем массив с одним каналом
      const channel = await this.getMyChannel()
      return [channel]
    } catch (error: unknown) {
      // Если канала нет, возвращаем пустой массив
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        return []
      }
      if (error instanceof Error && error.message?.includes('not found')) {
        return []
      }
      throw error
    }
  }

  // Получение канала (публичный)
  async getChannel(name?: string): Promise<Channel> {
    const params = name ? { name } : undefined
    return this.get<Channel>('/channel/get_channel', params)
  }

  // Получение канала по ID (для будущего расширения API)
  async getChannelById(channelId: number): Promise<Channel> {
    return this.get<Channel>(`/channel/${channelId}`)
  }

  // Обновление канала
  async updateChannel(channelData: ChannelUpdate): Promise<Channel> {
    return this.put<Channel>('/channel/put_channel', channelData)
  }

  // Обновление конкретного канала по ID (для будущего расширения API)
  async updateChannelById(channelId: number, channelData: ChannelUpdate): Promise<Channel> {
    return this.put<Channel>(`/channel/${channelId}`, channelData)
  }

  // Обновление изображения профиля канала
  async updateChannelProfileImage(imageFile: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', imageFile)
    return this.putFormData<string>('/channel/put_profile_image', formData)
  }

  // Обновление изображения профиля конкретного канала
  async updateChannelProfileImageById(channelId: number, imageFile: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', imageFile)
    return this.putFormData<string>(`/channel/${channelId}/profile_image`, formData)
  }

  // Обновление баннера канала
  async updateChannelBannerImage(imageFile: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', imageFile)
    return this.putFormData<string>('/channel/put_banner_image', formData)
  }

  // Обновление баннера конкретного канала
  async updateChannelBannerImageById(channelId: number, imageFile: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', imageFile)
    return this.putFormData<string>(`/channel/${channelId}/banner_image`, formData)
  }

  // Удаление канала
  async deleteChannel(): Promise<string> {
    return this.delete<string>('/channel/delete_channel')
  }

  // Удаление конкретного канала по ID (для будущего расширения API)
  async deleteChannelById(channelId: number): Promise<string> {
    return this.delete<string>(`/channel/${channelId}`)
  }

  // === SUBSCRIPTION ENDPOINTS ===

  // Подписаться на канал
  async subscribe(subscriptionData: SubscriptionCreate): Promise<Subscription> {
    return this.post<Subscription>('/subscription/post_subscription', subscriptionData)
  }

  // Получить подписки
  async getSubscriptions(): Promise<SubscriptionResponse[]> {
    return this.get<SubscriptionResponse[]>('/subscription/get_subscriptions')
  }

  // Получить подписчиков
  async getSubscribers(): Promise<Subscription[]> {
    return this.get<Subscription[]>('/subscription/my_subscribers')
  }

  // Отписаться от канала
  async unsubscribe(subscriptionId: number): Promise<string> {
    return this.delete<string>('/subscription/delete_subscription', { ident: subscriptionId })
  }

  // === VIDEO ENDPOINTS ===

  // Загрузка видео
  async uploadVideo(videoFile: File, videoData: VideoUpload): Promise<Video> {
    const formData = new FormData()
    formData.append('vidyo', videoFile)
    formData.append('title', videoData.title)
    formData.append('description', videoData.description)
    formData.append('category', videoData.category)
    return this.postFormData<Video>('/video/post_video', formData)
  }

  // Получить мои видео
  async getMyVideos(): Promise<Video[]> {
    return this.get<Video[]>('/video/my_video')
  }

  // Получить видео (публичные)
  async getVideos(ident?: number, category?: VideoCategory): Promise<Video[]> {
    const params: Record<string, string | number> = {}
    if (ident) params.ident = ident
    if (category) params.category = category
    return this.get<Video[]>('/video/get_video', Object.keys(params).length > 0 ? params : undefined)
  }



  // Обновление видео
  async updateVideo(videoData: VideoUpdate): Promise<Video> {
    return this.put<Video>('/video/put_video', videoData)
  }

  // Удаление видео
  async deleteVideo(videoId: number): Promise<string> {
    return this.delete<string>('/video/delete_video', { video_id: videoId })
  }

  // === LIKE ENDPOINTS ===

  // Поставить лайк/дизлайк
  async addLike(likeData: LikeCreate): Promise<Like> {
    return this.post<Like>('/like/post_like', likeData)
  }

  // Получить лайки
  async getLikes(): Promise<Like[]> {
    return this.get<Like[]>('/like/get_like')
  }

  // Удалить лайк
  async deleteLike(likeId: number): Promise<string> {
    return this.delete<string>('/like/delete_like', { ident: likeId })
  }

  // === COMMENT ENDPOINTS ===

  // Добавить комментарий
  async addComment(commentData: CommentCreate): Promise<Comment> {
    return this.post<Comment>('/comment/post_comment', commentData)
  }

  // Получить комментарии видео (новый эндпоинт)
  async getVideoComments(videoId: string): Promise<VideoComment[]> {
    return this.get<VideoComment[]>(`/video/video_comment?video_id=${videoId}`)
  }

  // Обновить комментарий
  async updateComment(commentData: CommentUpdate): Promise<Comment> {
    return this.put<Comment>('/comment/put_comment', commentData)
  }

  // Удалить комментарий
  async deleteComment(commentId: number): Promise<string> {
    return this.delete<string>('/comment/delete_comment', { ident: commentId })
  }

  // === HISTORY ENDPOINTS ===

  // Добавить в историю
  async addToHistory(historyData: HistoryCreate): Promise<History> {
    return this.post<History>('/history/post_histor', historyData)
  }

  // Получить историю
  async getHistory(): Promise<History[]> {
    return this.get<History[]>('/history/get_history')
  }

  // Удалить из истории
  async deleteFromHistory(historyId: number): Promise<string> {
    return this.delete<string>('/history/delete_history', { ident: historyId })
  }

  // === PLAYLIST ENDPOINTS ===

  // Создать плейлист
  async createPlaylist(playlistData: PlaylistCreate): Promise<Playlist> {
    return this.post<Playlist>('/playlist/post_playlist', playlistData)
  }

  // Получить мои плейлисты
  async getMyPlaylists(): Promise<Playlist[]> {
    return this.get<Playlist[]>('/playlist/my_playlist')
  }

  // Получить плейлисты (публичные)
  async getPlaylists(): Promise<Playlist[]> {
    return this.get<Playlist[]>('/playlist/get_playlist')
  }

  // Получить плейлист по ID
  async getPlaylistById(playlistId: number): Promise<Playlist> {
    return this.get<Playlist>(`/playlist/get_playlist/${playlistId}`)
  }

  // Обновить плейлист
  async updatePlaylist(playlistId: number, playlistData: PlaylistUpdate): Promise<Playlist> {
    return this.put<Playlist>(`/playlist/put_playlist/${playlistId}`, playlistData)
  }

  // Удалить плейлист
  async deletePlaylist(playlistId: number): Promise<string> {
    return this.delete<string>('/playlist/delete_playlist', { playlist_id: playlistId })
  }

  // === PLAYLIST VIDEO ENDPOINTS ===

  // Добавить видео в плейлист
  async addVideoToPlaylist(playlistVideoData: PlaylistVideoCreate): Promise<PlaylistVideo> {
    return this.post<PlaylistVideo>('/playlist_video/post_playlist_video', playlistVideoData)
  }

  // Получить мои видео плейлисты
  async getMyPlaylistVideos(): Promise<PlaylistVideo[]> {
    return this.get<PlaylistVideo[]>('/playlist_video/my_playlist_video')
  }

  // Получить видео плейлисты (публичные)
  async getPlaylistVideos(): Promise<PlaylistVideo[]> {
    return this.get<PlaylistVideo[]>('/playlist_video/get_playlist_video')
  }

  // Получить видео конкретного плейлиста
  async getPlaylistVideosByPlaylistId(playlistId: number): Promise<PlaylistVideo[]> {
    return this.get<PlaylistVideo[]>(`/playlist_video/get_playlist_video/${playlistId}`)
  }

  // Удалить видео из плейлиста
  async removeVideoFromPlaylist(playlistVideoId: number): Promise<string> {
    return this.delete<string>('/playlist_video/delete_playlist_video', { ident: playlistVideoId })
  }

  // === SHORTS ENDPOINTS ===

  // Загрузка Shorts
  async uploadShorts(videoFile: File): Promise<Shorts> {
    const formData = new FormData()
    formData.append('video', videoFile)
    return this.postFormData<Shorts>('/shorts/post_shorts', formData)
  }

  // Получить Shorts
  async getShorts(): Promise<Shorts[]> {
    return this.get<Shorts[]>('/shorts/get_shorts')
  }

  // Удалить Shorts
  async deleteShorts(shortsId: number): Promise<string> {
    return this.delete<string>('/shorts/delete_shorts', { ident: shortsId })
  }

  // === AUTH ENDPOINTS ===

  // Логин
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    return this.postFormUrlencoded<TokenResponse>('/login/token', {
      grant_type: 'password',
      username: credentials.username,
      password: credentials.password,
      scope: '',
      client_id: '',
      client_secret: ''
    })
  }

  // Обновление токена
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    return this.post<TokenResponse>('/login/refresh_token', { refresh_token: refreshToken })
  }
}

// Экспортируем синглтон
export const apiClient = ApiClient.getInstance()
