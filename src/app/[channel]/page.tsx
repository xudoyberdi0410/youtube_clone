'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import type { Channel, Video } from '@/types/api'
import { ChannelHeader } from '@/modules/channel/ui/components/channel-header'
import { ChannelTabs } from '@/modules/channel/ui/components/channel-tabs'
import { VideoGrid } from '@/components/video/video-grid'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ChannelPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const channelName = params.channel as string
  const isChannel = searchParams.get('isChannel') === 'true'
  
  const [channel, setChannel] = useState<Channel | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'shorts' | 'playlists' | 'about'>('home')

  useEffect(() => {
    const loadChannelData = async () => {
      if (!channelName) return

      // Если это не канал (нет параметра isChannel), не загружаем данные канала
      if (!isChannel) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Получаем данные канала
        const channelData = await apiClient.getChannel(channelName)
        setChannel(channelData)

        // Получаем видео канала (пока используем общий endpoint для видео)
        // В будущем можно добавить endpoint для получения видео конкретного канала
        const allVideos = await apiClient.getVideos()
        // Пока просто показываем все видео, так как связь с каналом не реализована в API
        setVideos(allVideos)

      } catch (err) {
        console.error('Error loading channel:', err)
        setError(err instanceof Error ? err.message : 'Не удалось загрузить канал')
      } finally {
        setLoading(false)
      }
    }

    loadChannelData()
  }, [channelName, isChannel])

  // Если это не канал (нет параметра isChannel), показываем 404
  if (!isChannel && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              Страница не найдена
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

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              {error || 'Канал не найден'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Заголовок канала */}
      <ChannelHeader channel={channel} />
      
      {/* Вкладки канала */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <ChannelTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Контент канала */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Последние видео */}
            {videos.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Последние видео</h2>
                <VideoGrid videos={videos.slice(0, 6)} />
              </div>
            )}
            
            {/* О канале */}
            <div>
              <h2 className="text-xl font-semibold mb-4">О канале</h2>
              <p className="text-muted-foreground">
                {channel.description || 'Описание канала отсутствует'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Все видео</h2>
            {videos.length > 0 ? (
              <VideoGrid videos={videos} />
            ) : (
              <p className="text-muted-foreground">На этом канале пока нет видео</p>
            )}
          </div>
        )}

        {activeTab === 'shorts' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Shorts</h2>
            <p className="text-muted-foreground">Shorts пока не реализованы</p>
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Плейлисты</h2>
            <p className="text-muted-foreground">Плейлисты пока не реализованы</p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">О канале</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Описание</h3>
                <p className="text-muted-foreground">
                  {channel.description || 'Описание канала отсутствует'}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Статистика</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Подписчиков: {channel.subscribers_count || 0}</p>
                  <p>Видео: {videos.length}</p>
                  <p>Дата создания: {new Date(channel.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
