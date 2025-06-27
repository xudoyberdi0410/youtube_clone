// src/lib/utils/format.ts

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
  const now = new Date()
  const targetDate = new Date(date)
  const diffInMs = now.getTime() - targetDate.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`
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
 * Format subscriber count in YouTube style
 * @param count - Number of subscribers
 * @returns Formatted string (e.g., "1.2K subscribers", "3.4M subscribers")
 */
export const formatSubscriberCount = (count: number): string => {
  const formatted = formatViews(count)
  return `${formatted} subscriber${count === 1 ? '' : 's'}`
}
