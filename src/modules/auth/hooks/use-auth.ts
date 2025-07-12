'use client'

import { useState, useEffect, useRef } from 'react'
import { getCurrentUser, getAuthToken, shouldRefreshToken, ensureValidToken } from '../lib/auth-utils'
import type { User } from '@/types/auth'

export function useAuth() {
  // Синхронно проверяем наличие токена при инициализации
  const initialToken = typeof window !== 'undefined' ? getAuthToken() : null
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false
    // Проверяем кэш в sessionStorage
    const cachedAuth = sessionStorage.getItem('auth_cache')
    if (cachedAuth) {
      try {
        const { isLoggedIn: cached } = JSON.parse(cachedAuth)
        return cached && !!initialToken
      } catch {
        return !!initialToken
      }
    }
    return !!initialToken
  })
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    // Проверяем кэш пользователя в sessionStorage
    const cachedAuth = sessionStorage.getItem('auth_cache')
    if (cachedAuth) {
      try {
        const { user: cachedUser } = JSON.parse(cachedAuth)
        return cachedUser
      } catch {
        return null
      }
    }
    return null
  })
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true
    // Если есть кэш, не показываем загрузку
    const cachedAuth = sessionStorage.getItem('auth_cache')
    return !cachedAuth && !!initialToken
  })
  const [refreshKey, setRefreshKey] = useState(0)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const tokenCheckInterval = useRef<NodeJS.Timeout | null>(null)

  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) {
      setShowAuthDialog(true)
      return
    }
    action()
  }

  useEffect(() => {
    // Проверяем статус авторизации при загрузке
    const checkAuth = async () => {
      try {
        const token = getAuthToken()
        
        if (!token) {
          setIsLoggedIn(false)
          setUser(null)
          setLoading(false)
          return
        }

        // Устанавливаем loading только если он не установлен
        setLoading(prev => prev === false ? true : prev)

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
          // Сохраняем в кэш
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('auth_cache', JSON.stringify({
              isLoggedIn: true,
              user: userData
            }))
          }
        } else {
          setIsLoggedIn(false)
          setUser(null)
          // Очищаем кэш
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('auth_cache')
          }
        }
      } catch (error) {
        console.error('❌ Error checking auth:', error)
        setIsLoggedIn(false)
        setUser(null)
        // Очищаем кэш при ошибке
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('auth_cache')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Устанавливаем интервал для периодической проверки токена
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current)
      tokenCheckInterval.current = null
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
      // Очищаем кэш при изменении авторизации
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth_cache')
      }
      setRefreshKey(prev => prev + 1) // Принудительно перезапускаем эффект
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Также можем слушать кастомные события при логине/логауте
    window.addEventListener('authStateChanged', handleStorageChange)

    return () => {
      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current)
        tokenCheckInterval.current = null
      }
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChanged', handleStorageChange)
    }
  }, [refreshKey]) // Убираем loading из зависимостей чтобы избежать бесконечного цикла

  return { 
    isLoggedIn, 
    user, 
    loading,
    isAuthenticated: isLoggedIn,
    isLoading: loading,
    requireAuth,
    showAuthDialog,
    setShowAuthDialog
  }
}
