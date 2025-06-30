'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import type { Channel } from '@/types/api'

export function useChannel(channelName: string) {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChannel = async () => {
      if (!channelName) return

      try {
        setLoading(true)
        setError(null)

        // Используем имя канала как есть, сохраняя регистр
        const channelData = await apiClient.getChannel(channelName)
        setChannel(channelData)
      } catch (err) {
        console.error('Error loading channel:', err)
        setError(err instanceof Error ? err.message : 'Не удалось загрузить канал')
      } finally {
        setLoading(false)
      }
    }

    loadChannel()
  }, [channelName])

  return {
    channel,
    loading,
    error,
    refetch: () => {
      if (channelName) {
        setLoading(true)
        setError(null)
        // Повторно загружаем данные
      }
    }
  }
}
