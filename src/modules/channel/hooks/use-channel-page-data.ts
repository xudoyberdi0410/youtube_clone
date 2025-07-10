import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useChannel } from '@/modules/channel/hooks/use-channel'
import { apiClient } from '@/lib/api-client'
import type { Video } from '@/types/api'
import { t } from '@/lib/i18n'

export function useChannelPageData() {
  const searchParams = useSearchParams()
  const channelName = searchParams?.get('name')

  const { channel, loading: channelLoading, error: channelError } = useChannel(channelName || '')
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVideos = async () => {
      if (!channelName) {
        setError(t('channel.nameNotProvided'))
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const allVideos = await apiClient.getVideos()
        setVideos(allVideos)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('channel.failedToLoad'))
      } finally {
        setLoading(false)
      }
    }
    loadVideos()
  }, [channelName])

  return {
    channelName,
    channel,
    channelLoading,
    channelError,
    videos,
    loading,
    error,
  }
}
