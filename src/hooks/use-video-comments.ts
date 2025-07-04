// src/hooks/use-video-comments.ts

import { useState, useEffect, useCallback } from 'react'
import { ApiClient } from '@/lib/api-client'
import type { VideoComment } from '@/types/common'

interface UseVideoCommentsOptions {
  videoId: string
  immediate?: boolean
}

interface UseVideoCommentsState {
  comments: VideoComment[]
  isLoading: boolean
  error: string | null
  isClient: boolean
}

/**
 * Хук для получения комментариев видео через новый API эндпоинт
 * Защищен от hydration mismatch ошибок
 */
export function useVideoComments(options: UseVideoCommentsOptions) {
  const { videoId, immediate = true } = options
  
  const [state, setState] = useState<UseVideoCommentsState>({
    comments: [],
    isLoading: false,
    error: null,
    isClient: false,
  })

  // Определяем, выполняется ли код на клиенте
  useEffect(() => {
    setState(prev => ({ ...prev, isClient: true }))
  }, [])

  const loadComments = useCallback(async () => {
    if (!videoId || videoId === '' || !state.isClient) return
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      const comments = await apiClient.getVideoComments(videoId)
      
      // Сортируем по дате создания (новые сначала)
      const sortedComments = comments.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      
      setState(prev => ({
        ...prev,
        comments: sortedComments,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load comments'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }, [videoId, state.isClient])

  const refreshComments = useCallback(() => {
    if (videoId && videoId !== '' && state.isClient) {
      loadComments()
    }
  }, [loadComments, videoId, state.isClient])

  const addComment = useCallback(async (commentText: string) => {
    if (!videoId || videoId === '' || !state.isClient || !commentText.trim()) {
      throw new Error('Invalid parameters for adding comment')
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const apiClient = ApiClient.getInstance()
      
      // Создаем комментарий
      await apiClient.addComment({
        video_id: parseInt(videoId),
        comment: commentText.trim()
      })

      // Перезагружаем комментарии после успешного добавления
      await loadComments()
      
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add comment'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [videoId, state.isClient, loadComments])

  useEffect(() => {
    if (immediate && videoId && videoId !== '' && state.isClient) {
      loadComments()
    }
  }, [immediate, videoId, loadComments, state.isClient])

  return {
    comments: state.comments,
    isLoading: state.isLoading,
    error: state.error,
    commentsCount: state.comments.length,
    loadComments,
    refreshComments,
    addComment,
    isClient: state.isClient,
  }
}
