// Временный auth-utils без сложных зависимостей
import type { User, LoginData, RegisterData, TokenResponse } from '@/types/auth'

// Временная реализация без api-client для тестирования
export async function loginUser(data: LoginData): Promise<TokenResponse> {
  try {
    console.log('LoginUser called with:', data)
    
    // Формируем данные для OAuth2
    const formData = new URLSearchParams()
    formData.append('username', data.username)
    formData.append('password', data.password)
    formData.append('grant_type', 'password')

    const response = await fetch('http://localhost:8000/login/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const message = errorData.detail?.replace(/^400:\s*/, "") || "Ошибка входа"
      throw new Error(message)
    }

    const result = await response.json()
    
    // Сохраняем токены
    if (result.access_token) {
      localStorage.setItem('access_token', result.access_token)
      if (result.refresh_token) {
        localStorage.setItem('refresh_token', result.refresh_token)
      }
      
      // Уведомляем об изменении состояния авторизации
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'))
      }
    }

    return result
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export async function registerUser(data: RegisterData): Promise<User> {
  try {
    const response = await fetch('http://localhost:8000/post_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const message = errorData.detail?.replace(/^400:\s*/, "") || "Ошибка регистрации"
      throw new Error(message)
    }

    return await response.json()
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
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getAuthToken()
    if (!token) {
      return null
    }

    const response = await fetch('http://localhost:8000/get_own_lock', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })

    if (!response.ok) {
      // Если токен невалидный, очищаем его
      logout()
      return null
    }

    const userData = await response.json()
    console.log('User data from API:', userData) // Отладка
    return userData
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  try {
    const token = getAuthToken()
    if (!token) throw new Error('Not authenticated')

    const response = await fetch('http://localhost:8000/put_own', {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const message = errorData.detail?.replace(/^400:\s*/, "") || "Ошибка обновления профиля"
      throw new Error(message)
    }

    const result = await response.json()
    
    // Уведомляем об изменении состояния
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'))
    }
    
    return result
  } catch (error) {
    console.error('Update profile error:', error)
    throw error
  }
}

export async function uploadAvatar(file: File): Promise<User> {
  try {
    const token = getAuthToken()
    if (!token) throw new Error('Not authenticated')

    console.log('Uploading avatar file:', file.name, file.size) // Отладка

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('http://localhost:8000/load_image', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Avatar upload error:', errorData) // Отладка
      const message = errorData.detail?.replace(/^400:\s*/, "") || "Ошибка загрузки изображения"
      throw new Error(message)
    }

    const result = await response.json()
    console.log('Avatar upload result:', result) // Отладка
    
    // Уведомляем об изменении состояния
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'))
    }
    
    return result
  } catch (error) {
    console.error('Upload avatar error:', error)
    throw error
  }
}

export async function deleteAccount(): Promise<void> {
  try {
    const token = getAuthToken()
    if (!token) throw new Error('Not authenticated')

    const response = await fetch('http://localhost:8000/users/delete', {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const message = errorData.detail?.replace(/^400:\s*/, "") || "Ошибка удаления аккаунта"
      throw new Error(message)
    }

    // Очищаем локальные данные после удаления
    logout()
    
    console.log('Account deleted successfully')
  } catch (error) {
    console.error('Delete account error:', error)
    throw error
  }
}

export async function refreshToken(): Promise<TokenResponse | null> {
  try {
    const refresh = localStorage.getItem('refresh_token') || localStorage.getItem('refreshToken')
    if (!refresh) {
      throw new Error('No refresh token available')
    }

    const response = await fetch('http://localhost:8000/login/refresh_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    })

    if (!response.ok) {
      logout()
      throw new Error('Failed to refresh token')
    }

    const result = await response.json()
    
    // Обновляем токены
    if (result.access_token) {
      localStorage.setItem('access_token', result.access_token)
      if (result.refresh_token) {
        localStorage.setItem('refresh_token', result.refresh_token)
      }
      
      // Уведомляем об изменении состояния
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'))
      }
    }

    return result
  } catch (error) {
    console.error('Token refresh error:', error)
    logout()
    return null
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const token = getAuthToken()
    if (!token) throw new Error('Not authenticated')

    const response = await fetch('http://localhost:8000/get_all_users', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    return await response.json()
  } catch (error) {
    console.error('Get all users error:', error)
    throw error
  }
}

// Helper функции
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
    return `http://localhost:8000${user.avatar}${cacheBuster || ''}`
  }
  
  // Если это уже полный URL
  if (user.avatar.startsWith('http')) {
    return `${user.avatar}${cacheBuster || ''}`
  }
  
  // По умолчанию добавляем базовый URL
  return `http://localhost:8000/${user.avatar}${cacheBuster || ''}`
}
