// src/lib/utils/video-mapper.ts

import type { Video as ApiVideo } from '@/types/api'
import type { Video } from '@/types/video'
import { formatApiDateLocal, formatVideoDuration } from '@/lib/utils/format'

/**
 * Преобразует видео из API формата в формат компонентов
 */
export function mapApiVideoToVideo(apiVideo: ApiVideo): Video {
  // Создаем базовый URL для медиа файлов
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://youtube-jfmi.onrender.com'
  
  return {
    id: apiVideo.id.toString(),
    // Используем новые поля API с fallback на старые для совместимости
    title: apiVideo.video_title || apiVideo.title || 'Untitled',
    description: apiVideo.video_description || apiVideo.description || '',
    views: apiVideo.video_views || apiVideo.views || 0,
    likes: apiVideo.like_amount || 0,
    dislikes: apiVideo.dislike_amount || 0,
    commentsCount: 0, // Нет в API, пока устанавливаем 0
    channel: {
      id: `channel-${apiVideo.id}`, // Используем уникальный ID для каждого видео
      name: apiVideo.channel_name || apiVideo.name || 'Unknown Channel',
      avatarUrl: apiVideo.profile_image 
        ? `${baseUrl}/images/${apiVideo.profile_image}`
        : '/avatars/g53bfu5y.png',
      isVerified: false,
      subscriberCount: '0', // Нет в API
      description: '',
      bannerUrl: undefined,
      createdAt: apiVideo.created_at
    },
    preview: apiVideo.thumbnail_path 
      ? `${baseUrl}/${apiVideo.thumbnail_path.replace(/\\/g, '/')}`
      : '/previews/previews1.png',
    videoUrl: apiVideo.file_path 
      ? `${baseUrl}/${apiVideo.file_path.replace(/\\/g, '/')}`
      : '',
    duration: formatVideoDuration(apiVideo.duration_video || apiVideo.duration),
    uploadedAt: formatApiDateLocal(apiVideo.created_at),
    isPrivate: false,
    tags: [],
    category: apiVideo.category,
    thumbnails: {
      default: apiVideo.thumbnail_path 
        ? `${baseUrl}/${apiVideo.thumbnail_path.replace(/\\/g, '/')}`
        : '/previews/previews1.png',
      medium: apiVideo.thumbnail_path 
        ? `${baseUrl}/${apiVideo.thumbnail_path.replace(/\\/g, '/')}`
        : '/previews/previews1.png',
      high: apiVideo.thumbnail_path 
        ? `${baseUrl}/${apiVideo.thumbnail_path.replace(/\\/g, '/')}`
        : '/previews/previews1.png'
    }
  }
}

/**
 * Форматирует количество подписчиков в читаемый вид
 */
export function formatSubscriberCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}
