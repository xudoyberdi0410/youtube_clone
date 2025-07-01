// src/hooks/use-playlist.ts

import { useState, useEffect, useCallback } from 'react'
import { ApiClient } from '@/lib/api-client'
import type { Playlist, PlaylistVideo } from '@/types/api'

interface UsePlaylistState {
  playlist: Playlist | null
  playlistVideos: PlaylistVideo[]
  isLoading: boolean
  error: string | null
}

export function usePlaylist(playlistId: number | null) {
  const [state, setState] = useState<UsePlaylistState>({
    playlist: null,
    playlistVideos: [],
    isLoading: false,
    error: null,
  })

  const loadPlaylist = useCallback(async () => {
    if (!playlistId) {
      setState({
        playlist: null,
        playlistVideos: [],
        isLoading: false,
        error: null,
      })
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      
      // Загружаем данные плейлиста
      const playlist = await apiClient.getPlaylistById(playlistId)
      
      // Загружаем видео плейлиста
      let playlistVideos: PlaylistVideo[] = []
      try {
        playlistVideos = await apiClient.getPlaylistVideosByPlaylistId(playlistId)
      } catch (err) {
        console.warn('Failed to load playlist videos:', err)
      }
      
      setState({
        playlist,
        playlistVideos,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load playlist'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }, [playlistId])

  const addVideoToPlaylist = useCallback(async (videoId: number) => {
    if (!playlistId) return

    try {
      const apiClient = ApiClient.getInstance()
      const newPlaylistVideo = await apiClient.addVideoToPlaylist({
        playlist_id: playlistId,
        video_id: videoId,
      })
      
      setState(prev => ({
        ...prev,
        playlistVideos: [...prev.playlistVideos, newPlaylistVideo],
      }))
      
      return newPlaylistVideo
    } catch (error) {
      throw error
    }
  }, [playlistId])

  const removeVideoFromPlaylist = useCallback(async (playlistVideoId: number) => {
    try {
      const apiClient = ApiClient.getInstance()
      await apiClient.removeVideoFromPlaylist(playlistVideoId)
      
      setState(prev => ({
        ...prev,
        playlistVideos: prev.playlistVideos.filter(pv => pv.id !== playlistVideoId),
      }))
    } catch (error) {
      throw error
    }
  }, [])

  const refetch = useCallback(() => {
    loadPlaylist()
  }, [loadPlaylist])

  useEffect(() => {
    loadPlaylist()
  }, [loadPlaylist])

  return {
    ...state,
    loadPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    refetch,
  }
}
