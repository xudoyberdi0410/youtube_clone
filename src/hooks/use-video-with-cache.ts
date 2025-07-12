"use client"

import { useState, useEffect, useCallback } from 'react'
import { Video } from '@/types/video'
import { useVideoCache } from './use-video-cache'

interface UseVideoWithCacheOptions {
  videoId: string
}

interface UseVideoWithCacheState {
  video: Video | null
  isLoading: boolean
  error: string | null
}

export function useVideoWithCache({ 
  videoId
}: UseVideoWithCacheOptions) {
  const { getVideo } = useVideoCache()
  const [state, setState] = useState<UseVideoWithCacheState>({
    video: null,
    isLoading: true,
    error: null
  })

  const loadVideo = useCallback(async () => {
    if (!videoId) {
      setState({ video: null, isLoading: false, error: null })
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const video = await getVideo(videoId)
      setState({
        video,
        isLoading: false,
        error: null
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load video'
      setState({
        video: null,
        isLoading: false,
        error: errorMessage
      })
    }
  }, [videoId, getVideo])

  useEffect(() => {
    loadVideo()
  }, [loadVideo])

  const refetch = useCallback(() => {
    loadVideo()
  }, [loadVideo])

  return {
    ...state,
    refetch
  }
} 