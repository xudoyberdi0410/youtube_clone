// src/components/video/LikedVideoCard.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trash2, ThumbsUp } from 'lucide-react'
import { buildImageUrl } from '@/lib/api-config'
import type { Video } from '@/types/api'

interface LikedVideoCardProps {
  video: Video
  likeId: number
  onRemoveLike: (likeId: number) => Promise<boolean>
}

export function LikedVideoCard({ video, likeId, onRemoveLike }: LikedVideoCardProps) {
  const channelName = video.name || 'Unknown Channel'
  const profileImage = video.profile_image

  const handleRemoveLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await onRemoveLike(likeId)
  }

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0:00'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatTimeAgo = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

      if (diffInSeconds < 60) return 'только что'
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин назад`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч назад`
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} дней назад`
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} мес назад`
      return `${Math.floor(diffInSeconds / 31536000)} лет назад`
    } catch {
      return dateString
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
      <div className="group cursor-pointer">
        <CardContent className="p-0">
          {/* Превью видео */}
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
            <Link href={`/watch?v=${video.id}`} className="block w-full h-full">
              {video.thumbnail_path ? (
                <Image
                  src={buildImageUrl(video.thumbnail_path)}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                  <span className="text-gray-400 dark:text-gray-300 text-sm">Нет превью</span>
                </div>
              )}
              
              {/* Продолжительность видео */}
              {video.duration && (
                <Badge className="absolute bottom-2 right-2 bg-black/80 text-white hover:bg-black/80 text-xs font-medium px-1.5 py-0.5 backdrop-blur-sm">
                  {formatDuration(video.duration)}
                </Badge>
              )}
              
              {/* Overlay при наведении */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </Link>
          </div>

          {/* Информация о видео */}
          <div className="p-4">
            <div className="flex gap-3">
              {/* Аватар канала */}
              <div className="flex-shrink-0">
                <Avatar className="w-9 h-9">
                  <AvatarImage 
                    src={buildImageUrl(profileImage || '')} 
                    alt={channelName}
                  />
                  <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                    {channelName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Детали видео */}
              <div className="flex-1 min-w-0">
                <Link href={`/watch?v=${video.id}`}>
                  <h3 className="font-medium line-clamp-2 text-sm leading-5 mb-2 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    {video.title}
                  </h3>
                </Link>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Link href={`/channel?name=${encodeURIComponent(channelName)}`} className="hover:underline focus:underline">
                    {channelName}
                  </Link>
                </p>
                
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>{video.views || 0} просмотров</span>
                  <span>•</span>
                  <span>{formatTimeAgo(video.created_at)}</span>
                </div>

                {/* Кнопка удаления лайка */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveLike}
                  className="w-full text-xs border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Удалить лайк
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}