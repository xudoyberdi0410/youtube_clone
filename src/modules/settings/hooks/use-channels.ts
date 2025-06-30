'use client'

import { useState, useEffect } from 'react'
import { Channel, ChannelCreate, ChannelUpdate } from '@/types/api'
import { apiClient } from '@/lib/api-client'

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Загружаем каналы при монтировании
  useEffect(() => {
    loadChannels()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadChannels = async () => {
    try {
      setLoading(true)
      setError(null)
      const channelsData = await apiClient.getMyChannels()
      setChannels(channelsData)
      
      // Выбираем первый канал по умолчанию
      if (channelsData.length > 0 && !selectedChannel) {
        setSelectedChannel(channelsData[0])
      }
    } catch (err: unknown) {
      console.error('Error loading channels:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load channels'
      setError(errorMessage)
      setChannels([])
    } finally {
      setLoading(false)
    }
  }

  const createChannel = async (channelData: ChannelCreate) => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const newChannel = await apiClient.createChannel(channelData)
      
      // Обновляем список каналов
      const updatedChannels = [...channels, newChannel]
      setChannels(updatedChannels)
      
      // Выбираем новый канал
      setSelectedChannel(newChannel)
      
      setSuccess('Channel created successfully!')
      
      return newChannel
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create channel'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const updateChannel = async (channelId: number, channelData: ChannelUpdate) => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      // Поскольку поддерживаем только один канал, используем основной эндпоинт
      const updatedChannel = await apiClient.updateChannel(channelData)
      
      // Обновляем канал в списке
      const updatedChannels = channels.map(channel => 
        channel.id === channelId ? updatedChannel : channel
      )
      setChannels(updatedChannels)
      
      // Обновляем выбранный канал, если это он
      if (selectedChannel?.id === channelId) {
        setSelectedChannel(updatedChannel)
      }
      
      setSuccess('Channel updated successfully!')
      
      return updatedChannel
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update channel'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const uploadProfileImage = async (channelId: number, file: File) => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      // Поскольку поддерживаем только один канал, используем основной эндпоинт
      await apiClient.updateChannelProfileImage(file)
      
      // Перезагружаем каналы, чтобы получить обновленные данные
      await loadChannels()
      setSuccess('Profile image updated successfully!')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload profile image'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const uploadBannerImage = async (channelId: number, file: File) => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      // Поскольку поддерживаем только один канал, используем основной эндпоинт
      await apiClient.updateChannelBannerImage(file)
      
      // Перезагружаем каналы, чтобы получить обновленные данные
      await loadChannels()
      setSuccess('Banner image updated successfully!')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload banner image'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const deleteChannel = async (channelId: number) => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      // Поскольку поддерживаем только один канал, используем основной эндпоинт
      await apiClient.deleteChannel()
      
      // Удаляем канал из списка
      const updatedChannels = channels.filter(channel => channel.id !== channelId)
      setChannels(updatedChannels)
      
      // Если удален выбранный канал, выбираем другой (если есть)
      if (selectedChannel?.id === channelId) {
        setSelectedChannel(updatedChannels.length > 0 ? updatedChannels[0] : null)
      }
      
      setSuccess('Channel deleted successfully!')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete channel'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const selectChannel = (channel: Channel) => {
    setSelectedChannel(channel)
    clearMessages()
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  return {
    channels,
    selectedChannel,
    loading,
    saving,
    error,
    success,
    createChannel,
    updateChannel,
    uploadProfileImage,
    uploadBannerImage,
    deleteChannel,
    selectChannel,
    clearMessages,
    refetch: loadChannels
  }
}
