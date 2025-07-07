'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { buildImageUrl } from '@/lib/api-config'
import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'
import type { Channel } from '@/types/api'
import Image from 'next/image'

interface ChannelHeaderProps {
  channel: Channel
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  const { isAuthenticated, user } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribersCount, setSubscribersCount] = useState(channel.subscribers_count || 0)
  const [loading, setLoading] = useState(false)

  const isOwnChannel = user?.id === channel.user_id

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в аккаунт, чтобы подписаться на канал',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      
      if (isSubscribed) {
        // Отписаться (нужно знать ID подписки)
        // Пока не реализовано
        toast({
          title: 'Функция отписки',
          description: 'Будет реализована позже',
          variant: 'default',
        })
      } else {
        // Подписаться
        await apiClient.subscribe({
          channel_id: channel.id
        })
        setIsSubscribed(true)
        setSubscribersCount(prev => prev + 1)
        toast({
          title: 'Подписка оформлена',
          description: `Вы подписались на канал ${channel.channel_name}`,
        })
      }
    } catch (error) {
      console.error('Subscription error:', error)
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить подписку',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!channel || !channel.channel_name) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        Канал не найден или данные отсутствуют.
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Баннер канала */}
      {channel.banner_image_url && (
        <div className="h-32 md:h-48 lg:h-64 overflow-hidden">
          <Image
            src={buildImageUrl(channel.banner_image_url)}
            alt={`${channel.channel_name} banner`}
            className="w-full h-full object-cover"
            fill
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Информация о канале */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Аватар канала */}
          <div className="flex-shrink-0">
            <Avatar className="w-20 h-20 md:w-32 md:h-32">
              <AvatarImage 
                src={buildImageUrl(channel.profile_image_url || '')} 
                alt={channel.channel_name}
              />
              <AvatarFallback className="text-2xl md:text-4xl">
                {channel.channel_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Информация о канале */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold truncate">
                  {channel.channel_name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <span>@{channel.channel_name}</span>
                  <span>•</span>
                  <span>{subscribersCount} подписчиков</span>
                </div>
                {channel.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {channel.description}
                  </p>
                )}
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-2">
                {!isOwnChannel && isAuthenticated && (
                  <Button
                    onClick={handleSubscribe}
                    disabled={loading}
                    variant={isSubscribed ? 'outline' : 'default'}
                    className="min-w-[100px]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>...</span>
                      </div>
                    ) : isSubscribed ? (
                      'Подписан'
                    ) : (
                      'Подписаться'
                    )}
                  </Button>
                )}
                
                {isOwnChannel && (
                  <Badge variant="secondary">
                    Ваш канал
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
