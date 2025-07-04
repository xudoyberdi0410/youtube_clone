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

interface LikedVideoCardProps {
  video: any
  likeId: number
  onRemoveLike: (likeId: number) => Promise<boolean>
}

export function LikedVideoCard({ video, likeId, onRemoveLike }: LikedVideoCardProps) {
  // YouTube-style card layout, using only available fields from API
  const channelName = video.channel_name || video.username || 'Канал'
  const videoTitle = video.video_title || video.title || 'Без названия'
  const thumbnail = video.thumbnail_path
  const views = video.video_views || video.views || 0
  const createdAt = video.created_at
  const videoId = video.video_id || video.id

  const handleRemoveLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await onRemoveLike(likeId)
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
    <div className="w-full max-w-full flex flex-col cursor-pointer group">
      <Link href={`/watch?v=${videoId}`} className="block w-full aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden rounded-xl">
        {thumbnail ? (
          <Image
            src={thumbnail.replace(/\\/g, '/')}
            alt={videoTitle}
            fill
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
            <span className="text-gray-400 dark:text-gray-300 text-sm">Нет превью</span>
          </div>
        )}
      </Link>
      <div className="flex flex-row gap-3 pt-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300">
          {channelName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/watch?v=${videoId}`}>
            <h3 className="font-semibold text-base leading-5 text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
              {videoTitle}
            </h3>
          </Link>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            <Link href={`/channel?name=${encodeURIComponent(channelName)}`} className="hover:underline">
              {channelName}
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span>{views} просмотров</span>
            <span>•</span>
            <span>{formatTimeAgo(createdAt)}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemoveLike}
          className="ml-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          title="Удалить лайк"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}