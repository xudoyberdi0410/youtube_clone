'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buildImageUrl } from '@/lib/api-config'
import type { Video } from '@/types/api'
import Image from 'next/image'

interface VideoGridProps {
  videos: Video[]
  className?: string
}

export function VideoGrid({ videos, className }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Видео не найдены</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className || ''}`}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

interface VideoCardProps {
  video: Video
}

function VideoCard({ video }: VideoCardProps) {
  const channelName = video.name // Используем поле name для имени канала
  const profileImage = video.profile_image

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/watch?v=${video.id}`}>
        <CardContent className="p-0">
          {/* Превью видео */}
          <div className="relative aspect-video bg-gray-100">
            {video.thumbnail_path ? (
              <Image
                src={buildImageUrl(video.thumbnail_path)}
                alt={video.title}
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-sm">Нет превью</span>
              </div>
            )}
            
            {/* Продолжительность видео */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {formatDuration(video.duration)}
              </div>
            )}
          </div>

          {/* Информация о видео */}
          <div className="p-3">
            <div className="flex gap-3">
              {/* Аватар канала */}
              <div className="flex-shrink-0">
                <Avatar className="w-9 h-9">
                  <AvatarImage 
                    src={buildImageUrl(profileImage || '')} 
                    alt={channelName}
                  />
                  <AvatarFallback>
                    {channelName?.charAt(0).toUpperCase() || 'V'}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Детали видео */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium line-clamp-2 text-sm leading-5 mb-1">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  <Link href={`/channel?name=${encodeURIComponent(channelName)}`} className="hover:underline focus:underline">
                    {channelName}
                  </Link>
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{video.views || 0} просмотров</span>
                  <span>•</span>
                  <span>
                    {video.created_at}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
