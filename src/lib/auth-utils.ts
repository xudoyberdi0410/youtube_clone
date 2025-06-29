// src/lib/auth-utils.ts

/**
 * Утилиты для работы с аутентификацией
 */

/**
 * Получает ID текущего пользователя из токена
 * TODO: Реализовать правильную декодировку JWT токена
 */
export function getCurrentUserId(): number | null {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('access_token')
  if (!token) return null
  
  try {
    // Простая заглушка - декодируем payload JWT токена
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub || payload.user_id || payload.id || 1
  } catch (error) {
    console.error('Failed to decode token:', error)
    return 1 // Временная заглушка
  }
}

/**
 * Проверяет, авторизован ли пользователь
 */
export function isUserAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return Boolean(localStorage.getItem('access_token'))
}
