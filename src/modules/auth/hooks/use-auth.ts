'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser, getAuthToken } from '../lib/auth-utils'
import type { User } from '@/types/auth'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

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

    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      setRefreshKey(prev => prev + 1) // Принудительно перезапускаем эффект
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Также можем слушать кастомные события при логине/логауте
    window.addEventListener('authStateChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChanged', handleStorageChange)
    }
  }, [refreshKey]) // Добавляем refreshKey как зависимость

  return { isLoggedIn, user, loading }
}
