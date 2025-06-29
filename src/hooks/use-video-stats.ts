// src/hooks/use-video-stats.ts

import { useState, useEffect } from 'react'
import { ApiClient } from '@/lib/api-client'
import { mapApiVideoToVideo } from '@/lib/utils/video-mapper'
import { useLikes } from '@/hooks/use-likes'
import { useComments } from '@/hooks/use-comments'
import { useSubscriptions } from '@/hooks/use-subscriptions'
import type { Video } from '@/types/api'

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
  const { videoId, channelId, immediate = true } = options
  
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

  const {
    commentsCount: userCommentsCount,
    isLoading: commentsLoading,
    error: commentsError
  } = useComments({ videoId, immediate })

  const subscriptionsHook = useSubscriptions({ channelId, immediate })
  const {
    isSubscribed,
    isLoading: subscriptionLoading,
    error: subscriptionError,
    toggleSubscription
  } = subscriptionsHook

  // Загружаем актуальную информацию о видео (включая like_amount)
  const loadVideoStats = async () => {
    if (!videoId) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const apiClient = ApiClient.getInstance()
      
      // Загружаем все видео и находим нужное для получения актуальной статистики
      const videos = await apiClient.getVideos()
      const apiVideo = videos.find(v => v.id.toString() === videoId)
      
      if (apiVideo) {
        // Используем данные из API напрямую
        setState(prev => ({
          ...prev,
          views: apiVideo.views || 0,
          likesCount: apiVideo.like_amount || 0, // Используем like_amount из API!
          dislikesCount: 0, // Нет в API
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
  }

  // Объединяем данные состояния пользователя (лайки, подписки) с загруженной статистикой
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isLiked,
      isDisliked,
      commentsCount: userCommentsCount,
      isSubscribed,
    }))
  }, [isLiked, isDisliked, userCommentsCount, isSubscribed])

  useEffect(() => {
    if (immediate && videoId) {
      loadVideoStats()
    }
  }, [immediate, videoId])

  const refreshStats = async () => {
    await loadVideoStats()
  }

  // Обертки для действий пользователя с автообновлением статистики
  const handleLike = async () => {
    await like()
    await refreshStats() // Обновляем статистику после лайка
  }

  const handleDislike = async () => {
    await dislike()
    await refreshStats() // Обновляем статистику после дизлайка
  }

  const handleToggleSubscription = async () => {
    await toggleSubscription()
    await refreshStats() // Обновляем статистику после подписки
  }

  const isLoadingAny = state.isLoading || likesLoading || commentsLoading || subscriptionLoading
  const combinedError = state.error || likesError || commentsError || subscriptionError

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
    isLoadingComments: commentsLoading,
    isLoadingSubscription: subscriptionLoading,
    isLoadingViews: state.isLoading,
  }
}
