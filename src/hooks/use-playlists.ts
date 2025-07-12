// src/hooks/use-playlists.ts

import { useState, useEffect, useCallback, useRef } from 'react'
import { ApiClient } from '@/lib/api-client'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import type { Playlist, PlaylistUpdate } from '@/types/api'

interface UsePlaylistsState {
  playlists: Playlist[]
  isLoading: boolean
  error: string | null
}

export function usePlaylists() {
  const { isLoggedIn, loading: authLoading } = useAuth()
  const isMountedRef = useRef(true)
  
  const [state, setState] = useState<UsePlaylistsState>({
    playlists: [],
    isLoading: false,
    error: null,
  })

  const loadPlaylists = useCallback(async () => {
    if (authLoading || !isLoggedIn || !isMountedRef.current) {
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
      
      if (isMountedRef.current) {
        setState({
          playlists,
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      if (!isMountedRef.current) return
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to load playlists'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }, [isLoggedIn, authLoading])

  const createPlaylist = useCallback(async (playlistData: Omit<Playlist, 'id' | 'created_at'>) => {
    if (authLoading || !isLoggedIn || !isMountedRef.current) {
      throw new Error('You must be logged in to create playlists')
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      const newPlaylist = await apiClient.createPlaylist(playlistData)
      
      if (isMountedRef.current) {
        setState(prev => ({
          playlists: [...prev.playlists, newPlaylist],
          isLoading: false,
          error: null,
        }))
      }
      
      return newPlaylist
    } catch (error) {
      if (!isMountedRef.current) return
      
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
    if (authLoading || !isLoggedIn || !isMountedRef.current) {
      throw new Error('You must be logged in to update playlists')
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      const updatedPlaylist = await apiClient.updatePlaylist(playlistId, playlistData)
      
      if (isMountedRef.current) {
        setState(prev => ({
          playlists: prev.playlists.map(playlist => 
            playlist.id === playlistId ? updatedPlaylist : playlist
          ),
          isLoading: false,
          error: null,
        }))
      }
      
      return updatedPlaylist
    } catch (error) {
      if (!isMountedRef.current) return
      
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
    if (authLoading || !isLoggedIn || !isMountedRef.current) {
      throw new Error('You must be logged in to delete playlists')
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      await apiClient.deletePlaylist(playlistId)
      
      if (isMountedRef.current) {
        setState(prev => ({
          playlists: prev.playlists.filter(playlist => playlist.id !== playlistId),
          isLoading: false,
          error: null,
        }))
      }
    } catch (error) {
      if (!isMountedRef.current) return
      
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
    if (isMountedRef.current) {
      loadPlaylists()
    }
  }, [loadPlaylists])

  useEffect(() => {
    loadPlaylists()
  }, [loadPlaylists])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return {
    ...state,
    loadPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    refetch,
  }
}
