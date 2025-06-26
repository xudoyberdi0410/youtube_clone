import { apiClient } from '@/lib/api-client'
import { API_CONFIG } from '@/lib/api-config'
import type { User, LoginData, RegisterData, TokenResponse } from '@/types/auth'

export async function loginUser(data: LoginData): Promise<TokenResponse> {
  try {
    const response = await apiClient.postFormUrlencoded<TokenResponse>(
      '/login/token', // Текущий endpoint бэкенда
      {
        username: data.username,
        password: data.password,
        grant_type: 'password'
      }
    )

    // Сохраняем токены
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token)
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token)
      }
      
      // Уведомляем об изменении состояния авторизации
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'))
      }
    }

    return response
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export async function registerUser(data: RegisterData): Promise<User> {
  try {
    const response = await apiClient.post<User>(
      '/post_user', // Текущий endpoint бэкенда
      data
    )
    
    console.log('Registration successful:', response)
    return response
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

export async function logout(): Promise<void> {
  try {
    // Очищаем токены из localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('authToken') // Для обратной совместимости
    localStorage.removeItem('refreshToken') // Для обратной совместимости
    
    // Уведомляем об изменении состояния авторизации
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'))
    }
      // Опционально: отправляем запрос на бэкенд для invalidation токена
    try {
      await apiClient.post('/auth/logout') // Будущий endpoint
    } catch {
      // Игнорируем ошибки logout на бэкенде
      console.warn('Backend logout failed')
    }
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = localStorage.getItem('access_token') || localStorage.getItem('authToken')
    if (!token) {
      return false    }

    // Проверяем токен, делая запрос к защищенному endpoint
    await apiClient.get('/get_own_lock') // Текущий endpoint бэкенда
    return true
  } catch {
    // Если токен невалидный, очищаем localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    return false
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = localStorage.getItem('access_token') || localStorage.getItem('authToken')
    if (!token) {
      return null
    }

    const user = await apiClient.get<User>('/get_own_lock') // Текущий endpoint бэкенда
    console.log('User data from API:', user) // Отладка
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    // Если токен невалидный, очищаем localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    return null
  }
}

export async function refreshToken(): Promise<TokenResponse | null> {
  try {
    const refresh_token = localStorage.getItem('refresh_token') || localStorage.getItem('refreshToken')
    if (!refresh_token) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<TokenResponse>(
      '/login/refresh_token', // Текущий endpoint бэкенда
      { refresh_token }
    )

    // Обновляем токены
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token)
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token)
      }
      
      // Уведомляем об изменении состояния
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'))
      }
    }

    return response
  } catch (error) {
    console.error('Token refresh error:', error)
    // Очищаем невалидные токены
    logout()
    return null
  }
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  try {
    const response = await apiClient.put<User>(
      '/put_own', // Текущий endpoint бэкенда
      data
    )
    
    console.log('Profile updated:', response)
    
    // Уведомляем об изменении состояния
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'))
    }
    
    return response
  } catch (error) {
    console.error('Update profile error:', error)
    throw error
  }
}

export async function uploadAvatar(file: File): Promise<User> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    console.log('Uploading avatar file:', file.name, file.size) // Отладка

    const response = await apiClient.postFormData<User>(
      '/load_image', // Текущий endpoint бэкенда
      formData
    )
    
    console.log('Avatar upload result:', response) // Отладка
    
    // Уведомляем об изменении состояния
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'))
    }
    
    return response
  } catch (error) {
    console.error('Upload avatar error:', error)
    throw error
  }
}

export async function deleteAccount(): Promise<void> {
  try {
    await apiClient.delete(API_CONFIG.ENDPOINTS.USERS.DELETE_ACCOUNT)
    
    // Очищаем локальные данные после удаления
    logout()
    
    console.log('Account deleted successfully')
  } catch (error) {
    console.error('Delete account error:', error)
    throw error
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await apiClient.get<User[]>('/get_all_users') // Текущий endpoint бэкенда
    return response
  } catch (error) {
    console.error('Get all users error:', error)
    throw error
  }
}

// Helper функции для токенов (для обратной совместимости)
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token') || localStorage.getItem('authToken')
}

// Helper функция для получения URL аватара с учетом временного локального пути
export function getAvatarUrl(user: User | Partial<User>, cacheBuster?: string): string {
  if (!user.avatar) return ''
  
  // Временно для локальных файлов
  if (user.avatar.includes('C:\\') || user.avatar.includes('images')) {
    // Преобразуем Windows путь в file:// URL
    const filePath = user.avatar.replace(/\\/g, '/')
    return `file:///${filePath}${cacheBuster || ''}`
  }
  
  // Для относительных путей API
  if (user.avatar.startsWith('/')) {
    return `${API_CONFIG.BASE_URL}${user.avatar}${cacheBuster || ''}`
  }
  
  // Если это уже полный URL
  if (user.avatar.startsWith('http')) {
    return `${user.avatar}${cacheBuster || ''}`
  }
  
  // По умолчанию добавляем базовый URL
  return `${API_CONFIG.BASE_URL}/${user.avatar}${cacheBuster || ''}`
}
