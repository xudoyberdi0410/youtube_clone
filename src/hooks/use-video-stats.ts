// src/hooks/use-video-stats.ts

import { useState, useEffect, useCallback } from 'react'
import { ApiClient } from '@/lib/api-client'
import { useLikes } from '@/hooks/use-likes'
import { useSubscriptions } from '@/hooks/use-subscriptions'

interface VideoStats {
  views: number
  likesCount: number
  dislikesCount: number
  commentsCount: number
  isLiked: boolean
  isDisliked: boolean
  isSubscribed: boolean
}

interface UseVideoStatsOptions {
  videoId?: string
  channelId?: string
  immediate?: boolean
}

interface UseVideoStatsState extends VideoStats {
  isLoading: boolean
  error: string | null
}

/**
 * Хук для загрузки актуальной статистики видео при открытии страницы
 */
export function useVideoStats(options: UseVideoStatsOptions) {
  const { videoId, immediate = true } = options
  
  const [state, setState] = useState<UseVideoStatsState>({
    views: 0,
    likesCount: 0,
    dislikesCount: 0,
    commentsCount: 0,
    isLiked: false,
    isDisliked: false,
    isSubscribed: false,
    isLoading: false,
    error: null,
  })

  // Используем хуки для получения состояния пользователя и методов действий
  const likesHook = useLikes({ videoId, immediate })
  const {
    isLiked,
    isDisliked,
    isLoading: likesLoading,
    error: likesError,
    like,
    dislike
  } = likesHook

  const subscriptionsHook = useSubscriptions({ immediate })
  const {
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = subscriptionsHook

  // Загружаем актуальную информацию о видео (включая like_amount)
  const loadVideoStats = useCallback(async () => {
    if (!videoId) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const apiClient = ApiClient.getInstance()
      
      // Загружаем все видео и находим нужное для получения актуальной статистики
      const videos = await apiClient.getVideos()
      const apiVideo = videos.find(v => v.id.toString() === videoId)
      
      if (apiVideo) {
        // Используем данные из API с новыми полями
        setState(prev => ({
          ...prev,
          views: apiVideo.video_views || apiVideo.views || 0,
          likesCount: apiVideo.like_amount || 0,
          dislikesCount: apiVideo.dislike_amount || 0,
          isLoading: false,
        }))
      } else {
        setState(prev => ({
          ...prev,
          error: 'Video not found',
          isLoading: false,
        }))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load video stats'
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))
    }
  }, [videoId])

  // Объединяем данные состояния пользователя (лайки) с загруженной статистикой
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isLiked,
      isDisliked,
      commentsCount: 0, // Убираем подсчет комментариев отсюда
      isSubscribed: false, // TODO: Implement subscription logic
    }))
  }, [isLiked, isDisliked])

  useEffect(() => {
    if (immediate && videoId) {
      loadVideoStats()
    }
  }, [immediate, videoId, loadVideoStats])

  const refreshStats = async () => {
    await loadVideoStats()
  }

  // Обертки для действий пользователя с автообновлением статистики
  const handleLike = async () => {
    await like()
    await refreshStats()
  }

  const handleDislike = async () => {
    await dislike()
    await refreshStats()
  }

  const handleToggleSubscription = async () => {
    // TODO: Implement subscription toggle logic
    console.log('Subscription toggle not implemented yet')
    await refreshStats()
  }

  const isLoadingAny = state.isLoading || likesLoading || subscriptionLoading
  const combinedError = state.error || likesError || subscriptionError

  return {
    ...state,
    error: combinedError,
    isLoading: isLoadingAny,
    refreshStats,
    // Методы для действий пользователя
    handleLike,
    handleDislike,
    handleToggleSubscription,
    // Отдельные индикаторы загрузки для каждой секции
    isLoadingLikes: likesLoading,
    isLoadingComments: false, // Убираем, так как комментарии теперь отдельно
    isLoadingSubscription: subscriptionLoading,
    isLoadingViews: state.isLoading,
  }
}
