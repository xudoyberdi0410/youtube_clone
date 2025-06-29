// src/hooks/use-likes.ts

import { useState, useEffect } from 'react'
import { ApiClient } from '@/lib/api-client'
import { getCurrentUserId } from '@/lib/auth-utils'
import { useAuth } from '@/hooks/use-auth'
import type { Like, LikeCreate } from '@/types/api'

interface UseLikesOptions {
  videoId?: string
  immediate?: boolean
}

interface UseLikesState {
  likes: Like[]
  isLoading: boolean
  error: string | null
  userLike: Like | null
  likesCount: number
  dislikesCount: number
}

/**
 * Хук для управления лайками/дизлайками видео
 */
export function useLikes(options: UseLikesOptions = {}) {
  const { videoId, immediate = true } = options
  const { requireAuth, isAuthenticated } = useAuth()
  
  const [state, setState] = useState<UseLikesState>({
    likes: [],
    isLoading: false,
    error: null,
    userLike: null,
    likesCount: 0,
    dislikesCount: 0,
  })

  const loadLikes = async () => {
    if (!isAuthenticated) return
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      const likes = await apiClient.getLikes()
      
      // Фильтруем лайки для текущего видео
      const videoLikes = videoId 
        ? likes.filter(like => like.video_id === parseInt(videoId))
        : likes
      
      // Находим лайк текущего пользователя
      const currentUserId = getCurrentUserId()
      const userLike = currentUserId 
        ? videoLikes.find(like => like.user_id === currentUserId) || null
        : null
      
      // Подсчитываем лайки и дизлайки
      const likesCount = videoLikes.filter(like => like.is_like).length
      const dislikesCount = videoLikes.filter(like => !like.is_like).length
      
      setState({
        likes: videoLikes,
        isLoading: false,
        error: null,
        userLike,
        likesCount,
        dislikesCount,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load likes'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }

  const toggleLike = async (isLike: boolean) => {
    if (!videoId) return
    
    requireAuth(async () => {
      try {
        const apiClient = ApiClient.getInstance()
        const videoIdNum = parseInt(videoId)
        
        // Если уже есть лайк/дизлайк пользователя
        if (state.userLike) {
          // Если нажали на тот же тип - удаляем
          if (state.userLike.is_like === isLike) {
            await apiClient.deleteLike(state.userLike.id)
            setState(prev => ({
              ...prev,
              userLike: null,
              likesCount: isLike ? prev.likesCount - 1 : prev.likesCount,
              dislikesCount: !isLike ? prev.dislikesCount - 1 : prev.dislikesCount,
            }))
            return
          } else {
            // Если нажали на противоположный тип - удаляем старый и создаем новый
            await apiClient.deleteLike(state.userLike.id)
          }
        }
        
        // Создаем новый лайк/дизлайк
        const likeData: LikeCreate = {
          video_id: videoIdNum,
          is_like: isLike
        }
        
        const newLike = await apiClient.addLike(likeData)
        
        setState(prev => ({
          ...prev,
          userLike: newLike,
          likesCount: isLike 
            ? (prev.userLike && !prev.userLike.is_like ? prev.likesCount + 1 : prev.likesCount + 1)
            : (prev.userLike && prev.userLike.is_like ? prev.likesCount - 1 : prev.likesCount),
          dislikesCount: !isLike 
            ? (prev.userLike && prev.userLike.is_like ? prev.dislikesCount + 1 : prev.dislikesCount + 1)
            : (prev.userLike && !prev.userLike.is_like ? prev.dislikesCount - 1 : prev.dislikesCount),
        }))
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to toggle like'
        setState(prev => ({ ...prev, error: errorMessage }))
      }
    })
  }

  const like = () => toggleLike(true)
  const dislike = () => toggleLike(false)

  useEffect(() => {
    if (immediate && isAuthenticated) {
      loadLikes()
    }
  }, [immediate, isAuthenticated, videoId])

  return {
    ...state,
    loadLikes,
    like,
    dislike,
    isLiked: state.userLike?.is_like === true,
    isDisliked: state.userLike?.is_like === false,
  }
}
