// src/hooks/use-video.ts

import { useState, useEffect, useCallback } from 'react'
import { ApiClient } from '@/lib/api-client'
import { mapApiVideoToVideo } from '@/lib/utils/video-mapper'
import type { Video } from '@/types/video'

interface UseVideoOptions {
  videoId: string
  immediate?: boolean
}

interface UseVideoState {
  video: Video | null
  isLoading: boolean
  error: string | null
}

/**
 * Хук для загрузки одного видео по ID
 */
export function useVideo(options: UseVideoOptions) {
  const { videoId, immediate = true } = options
  
  const [state, setState] = useState<UseVideoState>({
    video: null,
    isLoading: false,
    error: null,
  })

  const loadVideo = useCallback(async (id?: string) => {
    const targetId = id || videoId
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      
      // Загружаем все видео и ищем нужное по ID
      const apiVideos = await apiClient.getVideos()
      const apiVideo = apiVideos.find(v => v.id.toString() === targetId)
      
      if (!apiVideo) {
        throw new Error(`Video with ID ${targetId} not found`)
      }
      
      // Преобразуем API данные в формат компонентов
      const video = mapApiVideoToVideo(apiVideo)
      
      setState({
        video,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load video'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }, [videoId])

  const refetch = () => {
    loadVideo()
  }

  useEffect(() => {
    if (immediate && videoId) {
      loadVideo()
    }
  }, [immediate, videoId, loadVideo])

  return {
    ...state,
    loadVideo,
    refetch,
  }
}
