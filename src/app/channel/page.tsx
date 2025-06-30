'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import type { Channel, Video } from '@/types/api'
import { ChannelHeader } from '@/modules/channel/ui/components/channel-header'
import { ChannelTabs } from '@/modules/channel/ui/components/channel-tabs'
import { VideoGrid } from '@/components/video/video-grid'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ChannelPageWrapper() {
  return (
    <Suspense>
      <ChannelPage />
    </Suspense>
  )
}

function ChannelPage() {
  const searchParams = useSearchParams()
  const channelName = searchParams.get('name')
  
  const [channel, setChannel] = useState<Channel | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'shorts' | 'playlists' | 'about'>('home')

  useEffect(() => {
    const loadChannelData = async () => {
      if (!channelName) {
        setError('Имя канала не указано')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Получаем данные канала (имя сохраняет оригинальный регистр)
        const channelData = await apiClient.getChannel(channelName)
        setChannel(channelData)

        // Получаем видео канала
        const allVideos = await apiClient.getVideos()
        setVideos(allVideos)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить канал')
      } finally {
        setLoading(false)
      }
    }

    loadChannelData()
  }, [channelName])

  if (!channelName) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              Имя канала не указано
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!channel) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ChannelHeader channel={channel} />
      <ChannelTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === 'home' && <VideoGrid videos={videos} />}
        {activeTab === 'videos' && <VideoGrid videos={videos} />}
        {activeTab === 'shorts' && <div>Shorts (в разработке)</div>}
        {activeTab === 'playlists' && <div>Плейлисты (в разработке)</div>}
        {activeTab === 'about' && (
          <div className="prose max-w-none">
            <h2>О канале</h2>
            <p>{channel.description || 'Описание отсутствует'}</p>
            <p>Создан: {channel.created_at}</p>
          </div>
        )}
      </div>
    </div>
  )
}
