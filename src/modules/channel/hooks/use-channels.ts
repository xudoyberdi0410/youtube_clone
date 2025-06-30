'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import type { Channel } from '@/types/api'

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadChannels = async () => {
    try {
      setLoading(true)
      setError(null)

      // Пока API не поддерживает получение всех каналов
      // Можно попробовать получить мой канал как пример
      try {
        const myChannel = await apiClient.getMyChannel()
        setChannels([myChannel])
      } catch {
        // Если нет моего канала, оставляем пустой массив
        setChannels([])
      }
    } catch (err) {
      console.error('Error loading channels:', err)
      setError(err instanceof Error ? err.message : 'Не удалось загрузить каналы')
      setChannels([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChannels()
  }, [])

  return {
    channels,
    loading,
    error,
    refetch: loadChannels
  }
}

// Хук для получения популярных или рекомендуемых каналов (заглушка)
export function usePopularChannels() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Пока возвращаем пустой список, так как API не поддерживает эту функцию
  return {
    channels,
    loading,
    error,
    refetch: () => {}
  }
}
