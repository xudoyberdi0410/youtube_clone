// src/hooks/use-playlists.ts

import { useState, useEffect, useCallback } from 'react'
import { ApiClient } from '@/lib/api-client'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import type { Playlist } from '@/types/api'
import type { PlaylistCreate, PlaylistUpdate } from '@/types/api'

interface UsePlaylistsState {
  playlists: Playlist[]
  isLoading: boolean
  error: string | null
}

export function usePlaylists() {
  const { isLoggedIn, loading: authLoading } = useAuth()
  const [state, setState] = useState<UsePlaylistsState>({
    playlists: [],
    isLoading: false,
    error: null,
  })

  const loadPlaylists = useCallback(async () => {
    // Не загружаем, пока идет проверка аутентификации
    if (authLoading) {
      return
    }

    if (!isLoggedIn) {
      setState({
        playlists: [],
        isLoading: false,
        error: null,
      })
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      const playlists = await apiClient.getMyPlaylists()
      
      setState({
        playlists,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load playlists'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }, [isLoggedIn, authLoading])

  const createPlaylist = useCallback(async (playlistData: PlaylistCreate) => {
    if (authLoading || !isLoggedIn) {
      throw new Error('You must be logged in to create playlists')
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      const newPlaylist = await apiClient.createPlaylist(playlistData)
      
      setState(prev => ({
        playlists: [newPlaylist, ...prev.playlists],
        isLoading: false,
        error: null,
      }))
      
      return newPlaylist
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create playlist'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [isLoggedIn, authLoading])

  const updatePlaylist = useCallback(async (playlistId: number, playlistData: PlaylistUpdate) => {
    if (authLoading || !isLoggedIn) {
      throw new Error('You must be logged in to update playlists')
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      const updatedPlaylist = await apiClient.updatePlaylist(playlistId, playlistData)
      
      setState(prev => ({
        playlists: prev.playlists.map(playlist => 
          playlist.id === playlistId ? updatedPlaylist : playlist
        ),
        isLoading: false,
        error: null,
      }))
      
      return updatedPlaylist
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update playlist'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [isLoggedIn, authLoading])

  const deletePlaylist = useCallback(async (playlistId: number) => {
    if (authLoading || !isLoggedIn) {
      throw new Error('You must be logged in to delete playlists')
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      await apiClient.deletePlaylist(playlistId)
      
      setState(prev => ({
        playlists: prev.playlists.filter(playlist => playlist.id !== playlistId),
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete playlist'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [isLoggedIn, authLoading])

  const refetch = useCallback(() => {
    loadPlaylists()
  }, [loadPlaylists])

  useEffect(() => {
    loadPlaylists()
  }, [loadPlaylists])

  return {
    ...state,
    loadPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    refetch,
  }
}
