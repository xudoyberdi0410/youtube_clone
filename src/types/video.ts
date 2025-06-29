// src/types/video.ts

export interface Channel {
  id: string
  name: string
  avatarUrl: string
  isVerified?: boolean
  subscriberCount?: string
  description?: string
  bannerUrl?: string
  createdAt?: string
}

export interface Video {
  id: string
  title: string
  description?: string
  views: number
  likes?: number
  dislikes?: number
  commentsCount?: number
  channel: Channel
  preview: string
  videoUrl?: string
  duration: string
  uploadedAt: string
  isLive?: boolean
  isPrivate?: boolean
  tags?: string[]
  category?: string
  thumbnails?: {
    default: string
    medium?: string
    high?: string
  }
}

export interface VideoComment {
  id: string
  text: string
  author: {
    id: string
    name: string
    avatar: string
  }
  likes: number
  replies?: VideoComment[]
  createdAt: string
  isEdited?: boolean
}

export interface Playlist {
  id: string
  title: string
  description?: string
  thumbnail: string
  videos: Video[]
  videoCount: number
  views: number
  createdBy: Channel
  createdAt: string
  updatedAt: string
  isPrivate?: boolean
}

export interface VideoUploadData {
  title: string
  description?: string
  tags?: string[]
  category?: string
  isPrivate?: boolean
  thumbnail?: File
  video: File
}

export interface VideoMetadata {
  duration: number
  resolution: {
    width: number
    height: number
  }
  format: string
  fileSize: number
  aspectRatio: number
}

// Video player types
export interface VideoPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isFullscreen: boolean
  playbackRate: number
  quality: string
}

export interface VideoQuality {
  label: string
  value: string
  width: number
  height: number
}
