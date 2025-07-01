# 🎣 Хуки и утилиты

Подробное руководство по кастомным хукам и вспомогательным функциям в YouTube Clone проекте.

## 📋 Обзор хуков

### Категории хуков
```
src/hooks/
├── API хуки          # use-api.ts, use-videos.ts, use-auth.ts
├── UI хуки           # use-mobile.tsx, use-toast.ts
├── Utility хуки      # use-local-storage.ts, use-debounce.ts
└── Business хуки     # use-video-stats.ts, use-subscriptions.ts
```

## 🌐 API хуки

### useApi - Базовый API клиент
```typescript
// src/hooks/use-api.ts
import { useMemo } from 'react'
import { useAuth } from './use-auth'
import { ApiClient } from '@/lib/api-client'

export const useApi = () => {
  const { user } = useAuth()
  
  return useMemo(() => {
    return new ApiClient(user?.token)
  }, [user?.token])
}

// Использование
const MyComponent = () => {
  const api = useApi()
  
  const handleAction = async () => {
    const videos = await api.getAllVideos()
    console.log(videos)
  }
  
  return <button onClick={handleAction}>Загрузить видео</button>
}
```

### useVideos - Управление видео
```typescript
// src/hooks/use-videos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from './use-api'
import type { Video, VideoFilters, VideoUpload } from '@/types'

// Получение списка видео
export const useVideos = (filters?: VideoFilters) => {
  const api = useApi()
  
  return useQuery({
    queryKey: ['videos', filters],
    queryFn: () => api.getAllVideos(filters),
    staleTime: 5 * 60 * 1000, // 5 минут
    select: (data) => data.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    ),
  })
}

// Получение конкретного видео
export const useVideo = (videoId: number) => {
  const api = useApi()
  
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => api.getVideoById(videoId),
    enabled: !!videoId,
    staleTime: 10 * 60 * 1000, // 10 минут
  })
}

// Загрузка нового видео
export const useUploadVideo = () => {
  const api = useApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (videoData: VideoUpload) => api.uploadVideo(videoData),
    onSuccess: (newVideo) => {
      // Инвалидируем кеш видео
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      
      // Добавляем новое видео в кеш
      queryClient.setQueryData(['video', newVideo.id], newVideo)
      
      // Обновляем список видео пользователя
      queryClient.invalidateQueries({ 
        queryKey: ['videos', { channelId: newVideo.channelId }] 
      })
    },
    onError: (error) => {
      console.error('Upload failed:', error)
    },
  })
}

// Поиск видео
export const useSearchVideos = (query: string) => {
  const api = useApi()
  
  return useQuery({
    queryKey: ['videos', 'search', query],
    queryFn: () => api.searchVideos(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 минуты
  })
}

// Трендовые видео
export const useTrendingVideos = () => {
  const api = useApi()
  
  return useQuery({
    queryKey: ['videos', 'trending'],
    queryFn: () => api.getTrendingVideos(),
    staleTime: 30 * 60 * 1000, // 30 минут
  })
}

// Видео канала
export const useChannelVideos = (channelId: number, limit = 20) => {
  const api = useApi()
  
  return useQuery({
    queryKey: ['videos', 'channel', channelId, limit],
    queryFn: () => api.getChannelVideos(channelId, limit),
    enabled: !!channelId,
  })
}
```

### useAuth - Аутентификация
```typescript
// src/hooks/use-auth.ts
import { useContext } from 'react'
import { AuthContext } from '@/modules/auth/context/auth-context'

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  
  return context
}

// Дополнительные хуки для удобства
export const useIsAuthenticated = () => {
  const { user, isLoading } = useAuth()
  return { isAuthenticated: !!user, isLoading }
}

export const useRequireAuth = () => {
  const { user, isLoading } = useAuth()
  
  if (!isLoading && !user) {
    throw new Error('Authentication required')
  }
  
  return user
}
```

### useLikes - Управление лайками
```typescript
// src/hooks/use-likes.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useApi } from './use-api'
import { useAuth } from './use-auth'

// Проверка лайка видео
export const useIsVideoLiked = (videoId: number) => {
  const api = useApi()
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['likes', 'video', videoId, user?.id],
    queryFn: () => api.isVideoLiked(videoId),
    enabled: !!user && !!videoId,
  })
}

// Лайк видео
export const useLikeVideo = () => {
  const api = useApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ videoId, isLiked }: { videoId: number; isLiked: boolean }) => 
      isLiked ? api.unlikeVideo(videoId) : api.likeVideo(videoId),
    onMutate: async ({ videoId, isLiked }) => {
      // Отменяем текущие запросы
      await queryClient.cancelQueries({ queryKey: ['video', videoId] })
      await queryClient.cancelQueries({ queryKey: ['likes', 'video', videoId] })
      
      // Сохраняем предыдущие данные
      const previousVideo = queryClient.getQueryData(['video', videoId])
      const previousLikeStatus = queryClient.getQueryData(['likes', 'video', videoId])
      
      // Оптимистичное обновление
      queryClient.setQueryData(['video', videoId], (old: any) => ({
        ...old,
        likeCount: old.likeCount + (isLiked ? -1 : 1),
      }))
      
      queryClient.setQueryData(['likes', 'video', videoId], !isLiked)
      
      return { previousVideo, previousLikeStatus }
    },
    onError: (err, { videoId }, context) => {
      // Откатываем изменения при ошибке
      queryClient.setQueryData(['video', videoId], context?.previousVideo)
      queryClient.setQueryData(['likes', 'video', videoId], context?.previousLikeStatus)
    },
    onSettled: ({ videoId }) => {
      // Обновляем данные после завершения
      queryClient.invalidateQueries({ queryKey: ['video', videoId] })
      queryClient.invalidateQueries({ queryKey: ['likes', 'video', videoId] })
    },
  })
}
```

### useComments - Управление комментариями
```typescript
// src/hooks/use-comments.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { useApi } from './use-api'
import type { Comment, CommentCreate } from '@/types'

// Получение комментариев с пагинацией
export const useComments = (videoId: number) => {
  const api = useApi()
  
  return useInfiniteQuery({
    queryKey: ['comments', videoId],
    queryFn: ({ pageParam = 0 }) => api.getComments(videoId, pageParam),
    enabled: !!videoId,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined
    },
  })
}

// Создание комментария
export const useCreateComment = () => {
  const api = useApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (commentData: CommentCreate) => api.createComment(commentData),
    onSuccess: (newComment) => {
      // Добавляем новый комментарий в начало списка
      queryClient.setQueryData(
        ['comments', newComment.videoId],
        (old: any) => {
          if (!old) return { pages: [[newComment]], pageParams: [0] }
          
          const newPages = [...old.pages]
          newPages[0] = [newComment, ...newPages[0]]
          
          return { ...old, pages: newPages }
        }
      )
      
      // Обновляем счетчик комментариев
      queryClient.setQueryData(
        ['video', newComment.videoId],
        (old: any) => ({
          ...old,
          commentCount: (old?.commentCount || 0) + 1,
        })
      )
    },
  })
}

// Удаление комментария
export const useDeleteComment = () => {
  const api = useApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ commentId, videoId }: { commentId: number; videoId: number }) => 
      api.deleteComment(commentId),
    onSuccess: (_, { commentId, videoId }) => {
      // Удаляем комментарий из списка
      queryClient.setQueryData(
        ['comments', videoId],
        (old: any) => {
          if (!old) return old
          
          const newPages = old.pages.map((page: Comment[]) =>
            page.filter(comment => comment.id !== commentId)
          )
          
          return { ...old, pages: newPages }
        }
      )
    },
  })
}
```

## 🖱️ UI хуки

### useMobile - Определение мобильного устройства
```typescript
// src/hooks/use-mobile.tsx
import { useState, useEffect } from 'react'

export const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    
    // Проверяем при монтировании
    checkMobile()
    
    // Слушаем изменения размера окна
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])
  
  return isMobile
}

// Расширенная версия с breakpoints
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('xs')
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      
      if (width >= 1280) setBreakpoint('xl')
      else if (width >= 1024) setBreakpoint('lg')
      else if (width >= 768) setBreakpoint('md')
      else if (width >= 640) setBreakpoint('sm')
      else setBreakpoint('xs')
    }
    
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])
  
  return {
    breakpoint,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl',
  }
}
```

### useToast - Уведомления
```typescript
// src/hooks/use-toast.ts
import { toast as sonnerToast } from 'sonner'

export const useToast = () => {
  return {
    toast: {
      success: (message: string, options?: any) => {
        sonnerToast.success(message, options)
      },
      error: (message: string, options?: any) => {
        sonnerToast.error(message, options)
      },
      info: (message: string, options?: any) => {
        sonnerToast.info(message, options)
      },
      warning: (message: string, options?: any) => {
        sonnerToast.warning(message, options)
      },
      loading: (message: string, options?: any) => {
        return sonnerToast.loading(message, options)
      },
      promise: <T>(
        promise: Promise<T>,
        options: {
          loading: string
          success: (data: T) => string
          error: (error: any) => string
        }
      ) => {
        return sonnerToast.promise(promise, options)
      },
      dismiss: (toastId?: string | number) => {
        sonnerToast.dismiss(toastId)
      },
    },
  }
}

// Специализированные toast хуки
export const useApiToast = () => {
  const { toast } = useToast()
  
  return {
    success: (message: string) => toast.success(message),
    error: (error: any) => {
      const message = error?.message || 'Произошла ошибка'
      toast.error(message)
    },
    loading: (message: string) => toast.loading(message),
    apiPromise: <T>(promise: Promise<T>, messages: {
      loading: string
      success: string | ((data: T) => string)
      error?: string | ((error: any) => string)
    }) => {
      return toast.promise(promise, {
        loading: messages.loading,
        success: typeof messages.success === 'function' 
          ? messages.success 
          : () => messages.success,
        error: messages.error || ((error: any) => error?.message || 'Ошибка'),
      })
    },
  }
}
```

## 🔧 Utility хуки

### useLocalStorage - Локальное хранилище
```typescript
// src/hooks/use-local-storage.ts
import { useState, useEffect, useCallback } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  // Состояние для хранения значения
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })
  
  // Функция для обновления localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Позволяем передавать функцию как в useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        if (valueToStore === null) {
          window.localStorage.removeItem(key)
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])
  
  // Функция для удаления значения
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])
  
  return [storedValue, setValue, removeValue]
}

// Специализированные хуки для конкретных данных
export const useSettings = () => {
  return useLocalStorage('user-settings', {
    theme: 'light' as 'light' | 'dark',
    language: 'ru',
    autoplay: true,
    volume: 1,
  })
}

export const useWatchHistory = () => {
  return useLocalStorage<number[]>('watch-history', [])
}

export const useViewPreferences = () => {
  return useLocalStorage('view-preferences', {
    gridSize: 'medium' as 'small' | 'medium' | 'large',
    showThumbnails: true,
    autoplayNext: false,
  })
}
```

### useDebounce - Дебаунс значений
```typescript
// src/hooks/use-debounce.ts
import { useState, useEffect } from 'react'

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// Хук для дебаунс callback функций
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>()
  
  const debouncedCallback = ((...args: Parameters<T>) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    const timer = setTimeout(() => {
      callback(...args)
    }, delay)
    
    setDebounceTimer(timer)
  }) as T
  
  return debouncedCallback
}

// Использование для поиска
export const useSearchWithDebounce = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  
  const { data: searchResults, isLoading } = useSearchVideos(debouncedSearchTerm)
  
  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading: isLoading && !!debouncedSearchTerm,
  }
}
```

### useIntersectionObserver - Отслеживание видимости
```typescript
// src/hooks/use-intersection-observer.ts
import { useState, useEffect, useRef } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<Element | null>(null)
  
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: options.threshold || 0,
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
      }
    )
    
    observer.observe(element)
    
    return () => {
      observer.disconnect()
    }
  }, [options.threshold, options.root, options.rootMargin, hasIntersected])
  
  return {
    elementRef,
    isIntersecting,
    hasIntersected,
  }
}

// Хук для ленивой загрузки изображений
export const useLazyImage = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)
  const { isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  })
  
  useEffect(() => {
    if (imageRef) {
      // @ts-ignore
      elementRef.current = imageRef
    }
  }, [imageRef])
  
  useEffect(() => {
    if (isIntersecting && src && !imageSrc) {
      setImageSrc(src)
    }
  }, [isIntersecting, src, imageSrc])
  
  return {
    imageSrc,
    setImageRef,
  }
}
```

## 🎬 Business логика хуки

### useVideoPlayer - Управление видеоплеером
```typescript
// src/hooks/use-video-player.ts
import { useState, useEffect, useCallback, RefObject } from 'react'

interface VideoPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playbackRate: number
  isFullscreen: boolean
  buffered: number
}

export const useVideoPlayer = (videoRef: RefObject<HTMLVideoElement>) => {
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    playbackRate: 1,
    isFullscreen: false,
    buffered: 0,
  })
  
  // Действия плеера
  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [videoRef])
  
  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [videoRef])
  
  const togglePlayPause = useCallback(() => {
    state.isPlaying ? pause() : play()
  }, [state.isPlaying, play, pause])
  
  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }, [videoRef])
  
  const setVolume = useCallback((volume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = Math.max(0, Math.min(1, volume))
    }
  }, [videoRef])
  
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
    }
  }, [videoRef])
  
  const setPlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }, [videoRef])
  
  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current) return
    
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [videoRef])
  
  // Event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const updateState = (updates: Partial<VideoPlayerState>) => {
      setState(prev => ({ ...prev, ...updates }))
    }
    
    const handleTimeUpdate = () => {
      updateState({ currentTime: video.currentTime })
    }
    
    const handleDurationChange = () => {
      updateState({ duration: video.duration })
    }
    
    const handlePlay = () => {
      updateState({ isPlaying: true })
    }
    
    const handlePause = () => {
      updateState({ isPlaying: false })
    }
    
    const handleVolumeChange = () => {
      updateState({ 
        volume: video.volume,
        isMuted: video.muted 
      })
    }
    
    const handleRateChange = () => {
      updateState({ playbackRate: video.playbackRate })
    }
    
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration
        updateState({ buffered: (bufferedEnd / duration) * 100 })
      }
    }
    
    const handleFullscreenChange = () => {
      updateState({ isFullscreen: !!document.fullscreenElement })
    }
    
    // Добавляем слушатели
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('volumechange', handleVolumeChange)
    video.addEventListener('ratechange', handleRateChange)
    video.addEventListener('progress', handleProgress)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('volumechange', handleVolumeChange)
      video.removeEventListener('ratechange', handleRateChange)
      video.removeEventListener('progress', handleProgress)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [videoRef])
  
  return {
    ...state,
    actions: {
      play,
      pause,
      togglePlayPause,
      seek,
      setVolume,
      toggleMute,
      setPlaybackRate,
      toggleFullscreen,
    },
  }
}
```

### useVideoStats - Статистика видео
```typescript
// src/hooks/use-video-stats.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from './use-api'
import { useAuth } from './use-auth'
import { useEffect } from 'react'

export const useVideoStats = (videoId: number) => {
  const api = useApi()
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['video-stats', videoId],
    queryFn: () => api.getVideoStats(videoId),
    enabled: !!videoId,
  })
}

// Хук для отслеживания просмотра
export const useVideoView = (videoId: number) => {
  const api = useApi()
  const queryClient = useQueryClient()
  
  const recordView = useMutation({
    mutationFn: () => api.recordVideoView(videoId),
    onSuccess: () => {
      // Обновляем статистику видео
      queryClient.invalidateQueries({ queryKey: ['video', videoId] })
      queryClient.invalidateQueries({ queryKey: ['video-stats', videoId] })
    },
  })
  
  // Автоматически записываем просмотр через 30 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      recordView.mutate()
    }, 30000) // 30 секунд
    
    return () => clearTimeout(timer)
  }, [videoId, recordView])
  
  return recordView
}

// Хук для отслеживания времени просмотра
export const useWatchTime = (videoId: number) => {
  const api = useApi()
  const [watchTime, setWatchTime] = useState(0)
  
  const updateWatchTime = useMutation({
    mutationFn: (time: number) => api.updateWatchTime(videoId, time),
  })
  
  const startWatching = useCallback(() => {
    const startTime = Date.now()
    
    return () => {
      const endTime = Date.now()
      const sessionTime = Math.floor((endTime - startTime) / 1000)
      setWatchTime(prev => prev + sessionTime)
      updateWatchTime.mutate(sessionTime)
    }
  }, [videoId, updateWatchTime])
  
  return {
    watchTime,
    startWatching,
  }
}
```

## 📋 Утилиты

### Форматирование
```typescript
// src/lib/utils/format.ts
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  
  return count.toString()
}

export const formatTimeAgo = (date: string | Date): string => {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
  
  const intervals = [
    { label: 'год', seconds: 31536000 },
    { label: 'месяц', seconds: 2592000 },
    { label: 'день', seconds: 86400 },
    { label: 'час', seconds: 3600 },
    { label: 'минута', seconds: 60 },
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${getPlural(count, interval.label)} назад`
    }
  }
  
  return 'только что'
}

const getPlural = (count: number, word: string): string => {
  const cases = {
    'год': ['год', 'года', 'лет'],
    'месяц': ['месяц', 'месяца', 'месяцев'],
    'день': ['день', 'дня', 'дней'],
    'час': ['час', 'часа', 'часов'],
    'минута': ['минута', 'минуты', 'минут'],
  }
  
  const wordCases = cases[word as keyof typeof cases] || [word, word, word]
  
  if (count % 10 === 1 && count % 100 !== 11) {
    return wordCases[0]
  }
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return wordCases[1]
  }
  return wordCases[2]
}
```

## 📖 Следующие разделы

- [Формы](./forms.md) - Работа с формами и валидацией
- [Создание компонентов](./creating-components.md) - Разработка UI компонентов
- [Тестирование](./testing.md) - Тестирование хуков и утилит
