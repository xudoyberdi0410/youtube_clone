'use client'

import { useState, useEffect, useRef } from 'react'
import { getCurrentUser, getAuthToken, shouldRefreshToken, ensureValidToken } from '../lib/auth-utils'
import type { User } from '@/types/auth'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const tokenCheckInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Проверяем статус авторизации при загрузке
    const checkAuth = async () => {
      setLoading(true)
      
      try {
        const token = getAuthToken()
        
        if (!token) {
          setIsLoggedIn(false)
          setUser(null)
          setLoading(false)
          return
        }

        // Проверяем, нужно ли обновить токен
        if (shouldRefreshToken()) {
          console.log('Token expires soon, refreshing...')
          const tokenValid = await ensureValidToken()
          if (!tokenValid) {
            setIsLoggedIn(false)
            setUser(null)
            setLoading(false)
            return
          }
        }

        // Пытаемся получить данные пользователя
        const userData = await getCurrentUser()
        if (userData) {
          setIsLoggedIn(true)
          setUser(userData)
        } else {
          setIsLoggedIn(false)
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Error checking auth:', error)
        setIsLoggedIn(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Устанавливаем интервал для периодической проверки токена
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current)
    }
    
    tokenCheckInterval.current = setInterval(async () => {
      const token = getAuthToken()
      if (token && shouldRefreshToken()) {
        console.log('Periodic token check - refreshing...')
        await ensureValidToken()
      }
    }, 60000) // Проверяем каждую минуту

    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      setRefreshKey(prev => prev + 1) // Принудительно перезапускаем эффект
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Также можем слушать кастомные события при логине/логауте
    window.addEventListener('authStateChanged', handleStorageChange)

    return () => {
      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current)
      }
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChanged', handleStorageChange)
    }
  }, [refreshKey]) // Добавляем refreshKey как зависимость

  return { isLoggedIn, user, loading }
}
