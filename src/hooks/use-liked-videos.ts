// src/hooks/use-liked-videos.ts

import { useState, useEffect, useCallback } from 'react'
import { ApiClient } from '@/lib/api-client'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import type { Video } from '@/types/api'

interface LikedVideoWithDetails {
  id: number
  user_id: number
  video_id: number
  is_like: boolean
  created_at: string
  video?: Video
}

interface UseLikedVideosState {
  likedVideos: LikedVideoWithDetails[]
  isLoading: boolean
  error: string | null
}

/**
 * Хук для управления списком понравившихся видео
 */
export function useLikedVideos() {
  const { isAuthenticated } = useAuth()
  
  const [state, setState] = useState<UseLikedVideosState>({
    likedVideos: [],
    isLoading: false,
    error: null,
  })

  const loadLikedVideos = useCallback(async () => {
    if (!isAuthenticated) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const apiClient = ApiClient.getInstance();
      const likesObj = await apiClient.getLikes();
      // Если ответ — объект, преобразуем его в массив
      const likesArr: LikedVideoWithDetails[] = Array.isArray(likesObj)
        ? likesObj as LikedVideoWithDetails[]
        : Object.values(likesObj || {}) as LikedVideoWithDetails[];
      // Фильтруем только лайки (is_like === true)
      const actualLikes = likesArr.filter((like) => like.is_like === true);
      setState({
        likedVideos: actualLikes,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load liked videos';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [isAuthenticated]);

  const removeLike = useCallback(async (likeId: number) => {
    try {
      const apiClient = ApiClient.getInstance()
      await apiClient.deleteLike(likeId)
      
      // Удаляем лайк из локального состояния
      setState(prev => ({
        ...prev,
        likedVideos: prev.likedVideos.filter(item => item.id !== likeId),
        error: null,
      }))
      
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove like'
      setState(prev => ({ ...prev, error: errorMessage }))
      return false
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadLikedVideos()
    }
  }, [isAuthenticated, loadLikedVideos])

  return {
    ...state,
    loadLikedVideos,
    removeLike,
  }
}