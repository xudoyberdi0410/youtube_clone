// API Configuration
export const API_CONFIG = {
  // Base URL для API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Временно используем локальную папку для изображений
  IMAGES_BASE_PATH: 'C:\\Users\\Khudoberdi\\Projects\\YouTubeCloneBackend\\images',
    // Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/login/token',
      REFRESH: '/login/refresh_token',
      // Note: No register or logout endpoints available in current API
    },
    // User endpoints
    USERS: {
      GET_OWN: '/get_own_lock',
      GET_ALL: '/get_users',
      CREATE: '/post_user',
      UPDATE_OWN: '/put_own',
      UPLOAD_AVATAR: '/load_image',
      DELETE_ACCOUNT: '/delete_self',
    },
    
    // Videos endpoints (для будущего использования)
    VIDEOS: {
      GET_ALL: '/videos',
      GET_BY_ID: (id: string) => `/videos/${id}`,
      UPLOAD: '/videos/upload',
      DELETE: (id: string) => `/videos/${id}`,
      LIKE: (id: string) => `/videos/${id}/like`,
      COMMENT: (id: string) => `/videos/${id}/comments`,
    },
    
    // Static files (временно локальные)
    STATIC: {
      IMAGES: '/images',
      AVATARS: '/images/avatars',
    }
  },
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Timeouts
  TIMEOUT: 30000, // 30 seconds
}

// Helper функция для построения полного URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper функция для построения URL изображения
export const buildImageUrl = (imagePath: string): string => {
  if (!imagePath) return ''
  
  // Если это уже полный URL
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Временно для локальных файлов - возвращаем file:// URL
  if (imagePath.includes('C:\\')) {
    return `file:///${imagePath.replace(/\\/g, '/')}`
  }
  
  // Для относительных путей добавляем базовый URL
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${API_CONFIG.BASE_URL}${cleanPath}`
}

// Helper функция для получения токена
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

// Helper функция для создания заголовков с авторизацией
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken()
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...(token && { Authorization: `Bearer ${token}` })
  }
}
