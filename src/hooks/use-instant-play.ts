"use client"

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useVideoCache } from './use-video-cache'

interface UseInstantPlayOptions {
  videoId: string
  videoUrl?: string
  currentTime?: number
}

export function useInstantPlay({
  videoId,
  videoUrl,
}: UseInstantPlayOptions) {
  const router = useRouter()
  const { preloadVideo } = useVideoCache()

  const navigateToWatch = useCallback(() => {
    // Предзагружаем данные видео
    preloadVideo(videoId)
    
    // Сохраняем состояние видео в sessionStorage для мгновенного воспроизведения
    if (videoUrl) {
      sessionStorage.setItem('instantPlay', JSON.stringify({
        videoId,
        videoUrl,
        currentTime: 0,
        timestamp: Date.now()
      }))
    }

    // Переходим на страницу просмотра
    router.push(`/watch?v=${videoId}`)
  }, [videoId, videoUrl, preloadVideo, router]);

  return {
    navigateToWatch
  }
} 