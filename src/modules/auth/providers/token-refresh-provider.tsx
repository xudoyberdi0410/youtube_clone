'use client'

import { useEffect } from 'react'
import { refreshToken, getAuthToken } from '../lib/auth-utils'

export function TokenRefreshProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const setupTokenRefresh = () => {
      // Обновляем токен каждые 50 минут (если access token живет час)
      intervalId = setInterval(async () => {
        const token = getAuthToken()
        if (token) {
          try {
            await refreshToken()
            console.log('Token refreshed successfully')
          } catch (error) {
            console.error('Failed to refresh token:', error)
            // Пользователь будет автоматически разлогинен в refreshToken()
          }
        }
      }, 50 * 60 * 1000) // 50 минут
    }

    // Запускаем только если пользователь авторизован
    const token = getAuthToken()
    if (token) {
      setupTokenRefresh()
    }    // Слушаем изменения авторизации
    const handleAuthChange = () => {
      clearInterval(intervalId)
      const token = getAuthToken()
      if (token) {
        setupTokenRefresh()
      }
    }

    window.addEventListener('authStateChanged', handleAuthChange)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('authStateChanged', handleAuthChange)
    }
  }, [])

  return <>{children}</>
}
