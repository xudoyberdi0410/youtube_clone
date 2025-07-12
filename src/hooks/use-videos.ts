// src/hooks/use-videos.ts

import { useState, useEffect, useCallback } from 'react'
import { ApiClient } from '@/lib/api-client'
import { mapApiVideoToVideo } from '@/lib/utils/video-mapper'
import type { Video } from '@/types/video'
import type { VideoCategory } from '@/types/api'

interface UseVideosOptions {
  category?: VideoCategory
  ident?: number
  immediate?: boolean
}

interface UseVideosState {
  videos: Video[]
  isLoading: boolean
  error: string | null
}

const CACHE_KEY = 'youtube_videos_cache'
const CACHE_TIMESTAMP_KEY = 'youtube_videos_cache_timestamp'
const CACHE_DURATION = 5 * 60 * 1000 // 5 минут

/**
 * Хук для загрузки видео с бэкенда с кэшированием
 */
export function useVideos(options: UseVideosOptions = {}) {
  const { category, ident, immediate = true } = options
  const [isHydrated, setIsHydrated] = useState(false)
  
  const [state, setState] = useState<UseVideosState>({
    videos: [],
    isLoading: false,
    error: null,
  })

  // Эффект для гидратации
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Функция для получения данных из кэша
  const getCachedData = useCallback(() => {
    if (typeof window === 'undefined') return null
    
    try {
      const cachedData = sessionStorage.getItem(CACHE_KEY)
      const cachedTimestamp = sessionStorage.getItem(CACHE_TIMESTAMP_KEY)
      
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp)
        const now = Date.now()
        
        // Проверяем, не истёк ли кэш
        if (now - timestamp < CACHE_DURATION) {
          return JSON.parse(cachedData) as Video[]
        }
      }
    } catch (error) {
      console.warn('Error reading from cache:', error)
    }
    
    return null
  }, [])

  // Функция для сохранения данных в кэш
  const setCachedData = useCallback((videos: Video[]) => {
    if (typeof window === 'undefined') return
    
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(videos))
      sessionStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
    } catch (error) {
      console.warn('Error saving to cache:', error)
    }
  }, [])

  const loadVideos = useCallback(async (categoryParam?: VideoCategory, identParam?: number, forceRefresh = false) => {
    // Если не форсируем обновление и нет параметров категории/ident, проверяем кэш
    if (!forceRefresh && !categoryParam && !identParam && !category && !ident && isHydrated) {
      const cachedVideos = getCachedData()
      if (cachedVideos) {
        setState({
          videos: cachedVideos,
          isLoading: false,
          error: null,
        })
        return
      }
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      const apiVideos = await apiClient.getVideos(identParam || ident, categoryParam || category)
      
      // Преобразуем API данные в формат компонентов
      const videos = apiVideos.map(mapApiVideoToVideo)
      
      // Кэшируем данные только если это запрос без фильтров
      if (!categoryParam && !identParam && !category && !ident) {
        setCachedData(videos)
      }
      
      setState({
        videos,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load videos'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }, [ident, category, getCachedData, setCachedData, isHydrated])

  const refetch = useCallback(() => {
    loadVideos(category, ident, true) // Форсируем обновление при refetch
  }, [loadVideos, category, ident])

  const changeCategory = useCallback((newCategory?: VideoCategory) => {
    loadVideos(newCategory, ident, true) // Форсируем обновление при смене категории
  }, [loadVideos, ident])

  useEffect(() => {
    if (immediate && isHydrated) {
      loadVideos()
    }
  }, [immediate, ident, loadVideos, isHydrated]) // убираем category из зависимостей, так как теперь используем changeCategory

  return {
    ...state,
    loadVideos,
    refetch,
    changeCategory,
  }
}
