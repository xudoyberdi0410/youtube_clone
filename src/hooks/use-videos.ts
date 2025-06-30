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

/**
 * Хук для загрузки видео с бэкенда
 */
export function useVideos(options: UseVideosOptions = {}) {
  const { category, ident, immediate = true } = options
  
  const [state, setState] = useState<UseVideosState>({
    videos: [],
    isLoading: false,
    error: null,
  })

  const loadVideos = useCallback(async (categoryParam?: VideoCategory, identParam?: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      const apiVideos = await apiClient.getVideos(identParam || ident, categoryParam || category)
      
      // Преобразуем API данные в формат компонентов
      const videos = apiVideos.map(mapApiVideoToVideo)
      
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
  }, [ident, category])

  const refetch = () => {
    loadVideos()
  }

  const changeCategory = (newCategory?: VideoCategory) => {
    loadVideos(newCategory)
  }

  useEffect(() => {
    if (immediate) {
      loadVideos()
    }
  }, [immediate, ident, loadVideos]) // убираем category из зависимостей, так как теперь используем changeCategory

  return {
    ...state,
    loadVideos,
    refetch,
    changeCategory,
  }
}
