"use client"

import { useState, useCallback } from 'react'
import { Video } from '@/types/video'
import { ApiClient } from '@/lib/api-client'
import { mapApiVideoToVideo } from '@/lib/utils/video-mapper'

interface VideoCache {
  [videoId: string]: {
    video: Video
    timestamp: number
  }
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 минут

class VideoCacheManager {
  private static instance: VideoCacheManager
  private cache: VideoCache = {}
  private loadingPromises: { [videoId: string]: Promise<Video> } = {}

  static getInstance(): VideoCacheManager {
    if (!VideoCacheManager.instance) {
      VideoCacheManager.instance = new VideoCacheManager()
    }
    return VideoCacheManager.instance
  }

  async getVideo(videoId: string): Promise<Video | null> {
    // Проверяем кэш
    const cached = this.cache[videoId]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.video
    }

    // Проверяем, не загружается ли уже
    const loadingPromise = this.loadingPromises[videoId]
    if (typeof loadingPromise !== 'undefined') {
      return loadingPromise
    }

    // Загружаем видео
    try {
      const promise = this.loadVideo(videoId)
      this.loadingPromises[videoId] = promise
      const video = await promise
      delete this.loadingPromises[videoId]
      return video
    } catch (error) {
      delete this.loadingPromises[videoId]
      throw error
    }
  }

  private async loadVideo(videoId: string): Promise<Video> {
    try {
      // getVideos возвращает массив, берем первый элемент
      const apiVideos = await ApiClient.getInstance().getVideos(Number(videoId))
      const apiVideo = Array.isArray(apiVideos) ? apiVideos[0] : apiVideos
      if (!apiVideo) throw new Error('Video not found')
      const video = mapApiVideoToVideo(apiVideo)
      // Сохраняем в кэш
      this.cache[videoId] = {
        video,
        timestamp: Date.now()
      }
      return video
    } catch (error) {
      throw error
    }
  }

  preloadVideo(videoId: string): void {
    // Предзагружаем видео в фоне
    this.getVideo(videoId).catch(() => {
      // Игнорируем ошибки предзагрузки
    })
  }

  clearCache(): void {
    this.cache = {}
  }
}

export function useVideoCache() {
  const [cacheManager] = useState(() => VideoCacheManager.getInstance())

  const getVideo = useCallback(async (videoId: string): Promise<Video | null> => {
    return cacheManager.getVideo(videoId)
  }, [cacheManager])

  const preloadVideo = useCallback((videoId: string) => {
    cacheManager.preloadVideo(videoId)
  }, [cacheManager])

  const clearCache = useCallback(() => {
    cacheManager.clearCache()
  }, [cacheManager])

  return {
    getVideo,
    preloadVideo,
    clearCache
  }
} 