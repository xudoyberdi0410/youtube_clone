import { API_CONSTANTS } from './constants'
import { getApiUrl, getProxyHeaders } from './proxy-config'

// API Configuration
export const API_CONFIG = {
  // Base URL для API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Временно используем локальную папку для изображений
  IMAGES_BASE_PATH: 'C:\\Users\\Khudoberdi\\Projects\\YouTubeCloneBackend\\images',
  
  // Endpoints
  ENDPOINTS: {
    // Auth endpoints (OAuth2)
    AUTH: {
      LOGIN: '/login/token',
      REFRESH: '/login/refresh_token',
      LOGOUT: '/auth/logout', // Для будущего использования
      // Note: No register or logout endpoints available in current API
    },
    
    // User endpoints (из реальной Swagger документации)
    USERS: {
      // Основные endpoints из Swagger
      CREATE: '/user/post_user',              // POST - Создание пользователя (регистрация)
      GET_USER: '/user/get_user',        // GET - Получить пользователя (требует авторизации)
      PUT_USER: '/user/put_user',        // PUT - Обновить пользователя (требует авторизации)
      POST_IMAGE: '/user/post_image',    // POST - Загрузить изображение пользователя
      
      // Возможно неактуальные endpoints (проверить отдельно)
      GET_OWN: '/user/get_user',        // GET - Получить свой профиль (исправлено на правильный эндпоинт)
      GET_ALL: '/get_all_users',         // GET - Получить всех пользователей
      UPDATE_OWN: '/put_own',            // PUT - Обновить свой профиль
      DELETE_ACCOUNT: '/delete_self',     // DELETE - Удалить свой аккаунт
      UPLOAD_AVATAR: '/load_image',       // POST - Загрузить аватар (старый)
      
      // Функции для динамических эндпоинтов
      GET_BY_ID: (id: string) => `/users/${id}`,
      DELETE_BY_ID: (id: string) => `/users/${id}`,
    },
    
    // Videos endpoints (для будущего использования)
    VIDEOS: {
      GET_ALL: '/videos',
      GET_BY_ID: (id: string) => `/videos/${id}`,
      UPLOAD: '/videos/upload',
      DELETE: (id: string) => `/videos/${id}`,
      LIKE: (id: string) => `/videos/${id}/like`,
      COMMENT: (id: string) => `/videos/${id}/comments`,
      // Дополнительные видео эндпоинты
      SEARCH: '/videos/search',
      TRENDING: '/videos/trending',
      BY_CATEGORY: (category: string) => `/videos/category/${category}`,
      BY_USER: (userId: string) => `/videos/user/${userId}`,
    },

    // Channels endpoints
    CHANNELS: {
      CREATE: '/channel/post_channel',                    // POST - Создать канал
      GET_MY: '/channel/my_channel',                      // GET - Получить мой канал
      GET_CHANNEL: '/channel/get_channel',                // GET - Получить канал (публичный)
      UPDATE: '/channel/put_channel',                     // PUT - Обновить канал
      DELETE: '/channel/delete_channel',                  // DELETE - Удалить канал
      UPLOAD_PROFILE: '/channel/post_profile_image',      // POST - Загрузить профильное изображение
      UPLOAD_BANNER: '/channel/post_banner_image',        // POST - Загрузить баннер
      UPDATE_PROFILE: '/channel/put_profile_image',       // PUT - Обновить профильное изображение
      UPDATE_BANNER: '/channel/put_banner_image',         // PUT - Обновить баннер
    },

    
    // Static files (временно локальные)
    STATIC: {
      IMAGES: '/images',
      AVATARS: '/images/avatars',
      VIDEOS: '/videos',
      THUMBNAILS: '/thumbnails',
    }
  } as const,
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Timeouts
  TIMEOUT: API_CONSTANTS.TIMEOUT,
  RETRY_ATTEMPTS: API_CONSTANTS.RETRY_ATTEMPTS,
  RETRY_DELAY: API_CONSTANTS.RETRY_DELAY,
}

// Helper функции для получения эндпоинтов
export const getEndpoint = {
  // Auth endpoints
  auth: {
    login: () => API_CONFIG.ENDPOINTS.AUTH.LOGIN,
    refresh: () => API_CONFIG.ENDPOINTS.AUTH.REFRESH,
    logout: () => API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
  },
  
  // User endpoints
  users: {
    // Основные операции
    getOwn: () => API_CONFIG.ENDPOINTS.USERS.GET_OWN,
    getAll: () => API_CONFIG.ENDPOINTS.USERS.GET_ALL,
    create: () => API_CONFIG.ENDPOINTS.USERS.CREATE,
    updateOwn: () => API_CONFIG.ENDPOINTS.USERS.UPDATE_OWN,
    deleteAccount: () => API_CONFIG.ENDPOINTS.USERS.DELETE_ACCOUNT,
    
    // Новые эндпоинты из Swagger
    getUser: () => API_CONFIG.ENDPOINTS.USERS.GET_USER,
    putUser: () => API_CONFIG.ENDPOINTS.USERS.PUT_USER,
    postImage: () => API_CONFIG.ENDPOINTS.USERS.POST_IMAGE,
    
    // Для загрузки аватара (два варианта)
    uploadAvatar: () => API_CONFIG.ENDPOINTS.USERS.UPLOAD_AVATAR,      // Старый эндпоинт
    uploadImage: () => API_CONFIG.ENDPOINTS.USERS.POST_IMAGE,          // Новый эндпоинт
    
    // Динамические эндпоинты
    getById: (id: string) => API_CONFIG.ENDPOINTS.USERS.GET_BY_ID(id),
    deleteById: (id: string) => API_CONFIG.ENDPOINTS.USERS.DELETE_BY_ID(id),
  },
  
  // Video endpoints
  videos: {
    getAll: () => API_CONFIG.ENDPOINTS.VIDEOS.GET_ALL,
    getById: (id: string) => API_CONFIG.ENDPOINTS.VIDEOS.GET_BY_ID(id),
    upload: () => API_CONFIG.ENDPOINTS.VIDEOS.UPLOAD,
    delete: (id: string) => API_CONFIG.ENDPOINTS.VIDEOS.DELETE(id),
    like: (id: string) => API_CONFIG.ENDPOINTS.VIDEOS.LIKE(id),
    comment: (id: string) => API_CONFIG.ENDPOINTS.VIDEOS.COMMENT(id),
    search: () => API_CONFIG.ENDPOINTS.VIDEOS.SEARCH,
    trending: () => API_CONFIG.ENDPOINTS.VIDEOS.TRENDING,
    byCategory: (category: string) => API_CONFIG.ENDPOINTS.VIDEOS.BY_CATEGORY(category),
    byUser: (userId: string) => API_CONFIG.ENDPOINTS.VIDEOS.BY_USER(userId),
  },
  
  // Channel endpoints
  channels: {
    create: () => API_CONFIG.ENDPOINTS.CHANNELS.CREATE,
    getMy: () => API_CONFIG.ENDPOINTS.CHANNELS.GET_MY,
    getChannel: () => API_CONFIG.ENDPOINTS.CHANNELS.GET_CHANNEL,
    update: () => API_CONFIG.ENDPOINTS.CHANNELS.UPDATE,
    delete: () => API_CONFIG.ENDPOINTS.CHANNELS.DELETE,
    uploadProfile: () => API_CONFIG.ENDPOINTS.CHANNELS.UPLOAD_PROFILE,
    uploadBanner: () => API_CONFIG.ENDPOINTS.CHANNELS.UPLOAD_BANNER,
    updateProfile: () => API_CONFIG.ENDPOINTS.CHANNELS.UPDATE_PROFILE,
    updateBanner: () => API_CONFIG.ENDPOINTS.CHANNELS.UPDATE_BANNER,
  },
  
  // Static files
  static: {
    images: () => API_CONFIG.ENDPOINTS.STATIC.IMAGES,
    avatars: () => API_CONFIG.ENDPOINTS.STATIC.AVATARS,
    videos: () => API_CONFIG.ENDPOINTS.STATIC.VIDEOS,
    thumbnails: () => API_CONFIG.ENDPOINTS.STATIC.THUMBNAILS,
  }
} as const

// Helper функция для построения полного URL с поддержкой проксирования
export const buildApiUrl = (endpoint: string): string => {
  return getApiUrl(endpoint)
}

// Helper функция для построения URL изображения
export const buildImageUrl = (imagePath: string): string => {
  if (!imagePath) {
    return ''
  }
  
  // Если это уже полный URL
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Временно для локальных файлов - возвращаем file:// URL
  if (imagePath.includes('C:\\')) {
    const fileUrl = `file:///${imagePath.replace(/\\/g, '/')}`
    return fileUrl
  }
  
  // Обрабатываем пути от API (например: "images\\20250626161836.jpg")
  let cleanPath = imagePath
  
  // Заменяем обратные слеши на прямые
  cleanPath = cleanPath.replace(/\\/g, '/')
  
  // Убираем начальный слеш если есть
  cleanPath = cleanPath.replace(/^\/+/, '')
  
  // Если путь не содержит папку и выглядит как имя файла, добавляем images/
  if (!cleanPath.includes('/') && (cleanPath.includes('.png') || cleanPath.includes('.jpg') || cleanPath.includes('.jpeg') || cleanPath.includes('.gif'))) {
    cleanPath = `images/${cleanPath}`
  }
  
  // Добавляем начальный слеш если его нет
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`
  }
  
  // Формируем полный URL
  const finalUrl = `${API_CONFIG.BASE_URL}${cleanPath}`
  return finalUrl
}

// Helper функция для получения токена
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

// Helper функция для создания заголовков с авторизацией и поддержкой проксирования
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken()
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...getProxyHeaders(),
    ...(token && { Authorization: `Bearer ${token}` })
  }
}
