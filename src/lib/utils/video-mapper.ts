// src/lib/utils/video-mapper.ts

import type { Video as ApiVideo } from '@/types/api'
import type { Video } from '@/types/video'

/**
 * Преобразует видео из API формата в формат компонентов
 */
export function mapApiVideoToVideo(apiVideo: ApiVideo): Video {
  // Создаем базовый URL для медиа файлов
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://youtube-jfmi.onrender.com'
  
  return {
    id: apiVideo.id.toString(),
    title: apiVideo.title,
    description: apiVideo.description,
    views: apiVideo.views || 0,
    likes: apiVideo.like_amount || 0,
    dislikes: 0, // Нет в API
    commentsCount: 0, // Нет в API, пока устанавливаем 0
    channel: {
      id: `channel-${apiVideo.id}`, // Используем уникальный ID для каждого видео
      name: apiVideo.name || 'Unknown Channel',
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
    duration: formatDuration(apiVideo.duration || 0),
    uploadedAt: formatRelativeTime(apiVideo.created_at),
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
function formatSubscriberCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

/**
 * Форматирует длительность из секунд в формат HH:MM:SS или MM:SS
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}

/**
 * Форматирует дату в относительное время
 */
function formatRelativeTime(dateString: string): string {
  // Парсим формат "26.06.2025 21:20:49"
  const [datePart, timePart] = dateString.split(' ')
  const [day, month, year] = datePart.split('.')
  const [hours, minutes, seconds] = timePart.split(':')
  
  const date = new Date(
    parseInt(year),
    parseInt(month) - 1, // месяцы в JS начинаются с 0
    parseInt(day),
    parseInt(hours),
    parseInt(minutes),
    parseInt(seconds)
  )
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2629746) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 31556952) {
    const months = Math.floor(diffInSeconds / 2629746)
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(diffInSeconds / 31556952)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }
}
