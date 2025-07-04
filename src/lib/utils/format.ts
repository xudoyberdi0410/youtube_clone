// src/lib/utils/format.ts

import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

/**
 * Format number of views in YouTube style
 * @param views - Number of views
 * @returns Formatted string (e.g., "1.2K", "3.4M")
 */
export const formatViews = (views: number): string => {
  if (views < 1000) return views.toString()
  if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
  if (views < 1000000000) return `${(views / 1000000).toFixed(1)}M`
  return `${(views / 1000000000).toFixed(1)}B`
}

/**
 * Format duration from seconds to HH:MM:SS or MM:SS format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Format file size in human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Format date to relative time (e.g., "2 days ago", "1 week ago")
 * @param date - Date string or Date object
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  let targetDate: Date
  if (typeof date === 'string' && date.match(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2}$/)) {
    const [datePart, timePart] = date.split(' ')
    const [day, month, year] = datePart.split('.')
    const [hours, minutes, seconds] = timePart.split(':')
    targetDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
    )
  } else {
    targetDate = new Date(date)
  }
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
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

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Форматирует количество подписчиков или просмотров в читаемый вид (1.2K, 3.4M)
 */
export const formatShortNumber = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

/**
 * Format API date from "2025-07-03T15:30:00" to "03.07.2025 15:30"
 * @param dateString - Date string from API
 * @returns Formatted date string
 */
export const formatApiDate = (dateString: string): string => {
  try {
    // Парсим ISO строку даты
    const date = parseISO(dateString)
    
    // Форматируем в нужный формат
    return format(date, 'dd.MM.yyyy HH:mm', { locale: ru })
  } catch (error) {
    // Если не удалось распарсить, возвращаем исходную строку
    console.warn('Failed to parse date:', dateString, error)
    return dateString
  }
}

/**
 * Format API date from "2025-07-03T15:30:00" to local time string
 * @param dateString - Date string from API (UTC+0)
 * @returns Formatted local date string
 */
export const formatApiDateLocal = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    return format(date, 'dd.MM.yyyy HH:mm', { locale: ru })
  } catch (error) {
    console.warn('Failed to parse date:', dateString, error)
    return dateString
  }
}

/**
 * Format duration from video API (seconds or duration_video field)
 * @param duration - Duration in seconds or string format like "02:00"
 * @returns Formatted duration string
 */
export const formatVideoDuration = (duration: number | string | undefined): string => {
  if (!duration) return '0:00'
  
  // Если уже строка в правильном формате, возвращаем как есть
  if (typeof duration === 'string' && duration.includes(':')) {
    return duration
  }
  
  // Если число, форматируем из секунд
  if (typeof duration === 'number') {
    return formatDuration(duration)
  }
  
  // Пытаемся преобразовать строку в число
  const seconds = parseInt(duration.toString(), 10)
  if (!isNaN(seconds)) {
    return formatDuration(seconds)
  }
  
  return '0:00'
}
