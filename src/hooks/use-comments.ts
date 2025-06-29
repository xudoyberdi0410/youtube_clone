// src/hooks/use-comments.ts

import { useState, useEffect } from 'react'
import { ApiClient } from '@/lib/api-client'
import { useAuth } from '@/hooks/use-auth'
import type { Comment, CommentCreate, CommentUpdate } from '@/types/api'

interface UseCommentsOptions {
  videoId?: string
  immediate?: boolean
}

interface UseCommentsState {
  comments: Comment[]
  isLoading: boolean
  error: string | null
  isPosting: boolean
}

/**
 * Хук для управления комментариями видео
 */
export function useComments(options: UseCommentsOptions = {}) {
  const { videoId, immediate = true } = options
  const { requireAuth, isAuthenticated } = useAuth()
  
  const [state, setState] = useState<UseCommentsState>({
    comments: [],
    isLoading: false,
    error: null,
    isPosting: false,
  })

  const loadComments = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      const allComments = await apiClient.getComments()
      
      // Фильтруем комментарии для текущего видео
      const videoComments = videoId 
        ? allComments.filter(comment => comment.video_id === parseInt(videoId))
        : allComments
      
      // Сортируем по дате создания (новые сначала)
      const sortedComments = videoComments.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      
      setState({
        comments: sortedComments,
        isLoading: false,
        error: null,
        isPosting: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load comments'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }

  const addComment = async (content: string) => {
    if (!videoId || !content.trim()) return
    
    requireAuth(async () => {
      setState(prev => ({ ...prev, isPosting: true, error: null }))
      
      try {
        const apiClient = ApiClient.getInstance()
        const commentData: CommentCreate = {
          video_id: parseInt(videoId),
          comment: content.trim()
        }
        
        const newComment = await apiClient.addComment(commentData)
        
        setState(prev => ({
          ...prev,
          comments: [newComment, ...prev.comments],
          isPosting: false,
        }))
        
        return newComment
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add comment'
        setState(prev => ({
          ...prev,
          isPosting: false,
          error: errorMessage,
        }))
        throw error
      }
    })
  }

  const updateComment = async (commentId: number, content: string) => {
    if (!videoId || !content.trim()) return
    
    requireAuth(async () => {
      try {
        const apiClient = ApiClient.getInstance()
        const commentData: CommentUpdate = {
          video_id: parseInt(videoId),
          comment: content.trim()
        }
        
        const updatedComment = await apiClient.updateComment(commentData)
        
        setState(prev => ({
          ...prev,
          comments: prev.comments.map(comment => 
            comment.id === commentId ? updatedComment : comment
          ),
        }))
        
        return updatedComment
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update comment'
        setState(prev => ({ ...prev, error: errorMessage }))
        throw error
      }
    })
  }

  const deleteComment = async (commentId: number) => {
    requireAuth(async () => {
      try {
        const apiClient = ApiClient.getInstance()
        await apiClient.deleteComment(commentId)
        
        setState(prev => ({
          ...prev,
          comments: prev.comments.filter(comment => comment.id !== commentId),
        }))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete comment'
        setState(prev => ({ ...prev, error: errorMessage }))
        throw error
      }
    })
  }

  useEffect(() => {
    if (immediate && videoId) {
      loadComments()
    }
  }, [immediate, videoId])

  return {
    ...state,
    loadComments,
    addComment,
    updateComment,
    deleteComment,
    commentsCount: state.comments.length,
  }
}
