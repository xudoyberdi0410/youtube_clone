# 🎯 Руководство по разработке

Принципы, стандарты и лучшие практики разработки в YouTube Clone проекте.

## 🏗️ Архитектурные принципы

### 1. Модульная архитектура
Приложение организовано по доменам (модулям), каждый из которых содержит свою логику:

```
src/modules/
├── auth/           # Авторизация и аутентификация
├── video/          # Работа с видео
├── channel/        # Управление каналами
├── playlist/       # Плейлисты
└── settings/       # Настройки пользователя
```

### 2. Separation of Concerns (Разделение ответственности)
- **Components** - только UI логика
- **Hooks** - состояние и side effects
- **Services** - бизнес-логика и API вызовы
- **Utils** - вспомогательные функции

### 3. Composition over Inheritance
Предпочитаем композицию наследованию:

```typescript
// ✅ Хорошо - композиция
const VideoCard = ({ video, children }) => (
  <Card>
    <VideoThumbnail video={video} />
    {children}
  </Card>
)

// ❌ Плохо - наследование
class VideoCard extends BaseCard {
  render() {
    return super.render() + this.renderVideo()
  }
}
```

## 📝 Соглашения по коду

### Именование файлов и папок
```
✅ Правильно:
- PascalCase для компонентов: `VideoCard.tsx`
- kebab-case для утилит: `format-utils.ts`
- kebab-case для хуков: `use-video-stats.ts`
- kebab-case для папок: `video-player/`

❌ Неправильно:
- videoCard.tsx
- formatUtils.ts
- useVideoStats.ts
- VideoPlayer/
```

### Структура компонентов
```typescript
// Порядок импортов
import React from 'react'                    // React импорты
import { useState, useEffect } from 'react'  // React hooks

import { Button } from '@/components/ui'     // UI компоненты
import { VideoCard } from '@/components'     // Локальные компоненты

import { useAuth } from '@/hooks'            // Хуки
import { api } from '@/lib/api-client'       // Сервисы
import { formatDuration } from '@/lib/utils' // Утилиты

import type { Video } from '@/types'         // Типы

// Интерфейс пропсов
interface VideoListProps {
  videos: Video[]
  onVideoClick?: (video: Video) => void
}

// Компонент
export const VideoList = ({ videos, onVideoClick }: VideoListProps) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {videos.map(video => (
        <VideoCard 
          key={video.id} 
          video={video} 
          onClick={() => onVideoClick?.(video)}
        />
      ))}
    </div>
  )
}
```

### TypeScript правила

#### 1. Явная типизация пропсов
```typescript
// ✅ Хорошо
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  children: React.ReactNode
}

// ❌ Плохо - использование any
interface ButtonProps {
  variant: any
  onClick: any
}
```

#### 2. Использование утилитарных типов
```typescript
// Pick для выбора полей
type UserProfile = Pick<User, 'id' | 'username' | 'avatar'>

// Omit для исключения полей
type CreateUser = Omit<User, 'id' | 'createdAt'>

// Partial для опциональных полей
type UpdateUser = Partial<User>
```

#### 3. Дискриминированные союзы
```typescript
type ApiResponse<T> = 
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T }

// Использование
const handleResponse = (response: ApiResponse<Video[]>) => {
  switch (response.status) {
    case 'loading':
      return <Spinner />
    case 'error':
      return <Error message={response.error} />
    case 'success':
      return <VideoList videos={response.data} />
  }
}
```

## 🎣 Паттерны работы с хуками

### 1. Кастомные хуки для API
```typescript
// src/hooks/use-videos.ts
export const useVideos = (params?: VideoQueryParams) => {
  const api = useApi()
  
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => api.getVideos(params),
    staleTime: 5 * 60 * 1000, // 5 минут
  })
}

// Специализированные хуки
export const useTrendingVideos = () => {
  return useVideos({ category: 'trending', limit: 20 })
}

export const useChannelVideos = (channelId: number) => {
  return useVideos({ channelId, limit: 50 })
}
```

### 2. Compound хуки
```typescript
// Хук, объединяющий несколько API вызовов
export const useVideoPage = (videoId: number) => {
  const video = useVideo(videoId)
  const comments = useComments(videoId)
  const relatedVideos = useRelatedVideos(videoId)
  const { user } = useAuth()
  
  const isLiked = useIsVideoLiked(videoId, user?.id)
  const likeVideo = useLikeVideo()
  
  return {
    video,
    comments,
    relatedVideos,
    isLiked,
    likeVideo,
    isLoading: video.isLoading || comments.isLoading,
    error: video.error || comments.error,
  }
}
```

### 3. Хуки для управления состоянием UI
```typescript
// src/hooks/use-video-player.ts
export const useVideoPlayer = (videoRef: RefObject<HTMLVideoElement>) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  
  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }, [])
  
  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])
  
  const togglePlayPause = useCallback(() => {
    isPlaying ? pause() : play()
  }, [isPlaying, play, pause])
  
  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])
  
  // Event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])
  
  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
  }
}
```

## 🎨 Паттерны компонентов

### 1. Compound Components
```typescript
// Accordion компонент
const AccordionContext = createContext<{
  openItems: string[]
  toggle: (value: string) => void
}>()

const Accordion = ({ children, defaultOpen = [] }) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)
  
  const toggle = (value: string) => {
    setOpenItems(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }
  
  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className="space-y-2">{children}</div>
    </AccordionContext.Provider>
  )
}

const AccordionItem = ({ value, children }) => {
  const { openItems } = useContext(AccordionContext)
  const isOpen = openItems.includes(value)
  
  return (
    <div className={`border rounded ${isOpen ? 'border-blue-500' : ''}`}>
      {children}
    </div>
  )
}

// Использование
<Accordion defaultOpen={['item1']}>
  <AccordionItem value="item1">
    <AccordionTrigger>Заголовок 1</AccordionTrigger>
    <AccordionContent>Содержимое 1</AccordionContent>
  </AccordionItem>
</Accordion>
```

### 2. Render Props паттерн
```typescript
interface DataFetcherProps<T> {
  url: string
  children: (data: {
    data: T | null
    loading: boolean
    error: string | null
    refetch: () => void
  }) => React.ReactNode
}

const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(url)
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [url])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  return <>{children({ data, loading, error, refetch: fetchData })}</>
}

// Использование
<DataFetcher<Video[]> url="/api/videos">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />
    if (error) return <Error message={error} />
    if (data) return <VideoList videos={data} />
    return null
  }}
</DataFetcher>
```

### 3. HOC (Higher-Order Components)
```typescript
// HOC для требования авторизации
function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthGuardedComponent(props: P) {
    const { user, isLoading } = useAuth()
    
    if (isLoading) {
      return <AuthLoadingSkeleton />
    }
    
    if (!user) {
      return <AuthRequiredMessage />
    }
    
    return <Component {...props} />
  }
}

// Использование
const ProtectedUploadPage = withAuth(VideoUploadPage)
```

## 🔄 Управление состоянием

### 1. Локальное состояние с useState
```typescript
// Простое состояние UI
const [isOpen, setIsOpen] = useState(false)
const [selectedTab, setSelectedTab] = useState('videos')

// Сложное состояние с useReducer
type State = {
  videos: Video[]
  loading: boolean
  error: string | null
  page: number
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Video[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'LOAD_MORE' }

const videoReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        videos: action.payload,
        error: null 
      }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'LOAD_MORE':
      return { ...state, page: state.page + 1 }
    default:
      return state
  }
}
```

### 2. Глобальное состояние с Context
```typescript
// Context для пользовательских настроек
interface SettingsContextType {
  theme: 'light' | 'dark'
  language: string
  autoplay: boolean
  updateSettings: (settings: Partial<Settings>) => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    // Загружаем из localStorage
    const saved = localStorage.getItem('settings')
    return saved ? JSON.parse(saved) : defaultSettings
  })
  
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('settings', JSON.stringify(updated))
      return updated
    })
  }, [])
  
  return (
    <SettingsContext.Provider value={{ ...settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}
```

### 3. Server State с TanStack Query
```typescript
// Кеширование и синхронизация
export const useVideos = (filters?: VideoFilters) => {
  return useQuery({
    queryKey: ['videos', filters],
    queryFn: () => api.getVideos(filters),
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
    refetchOnWindowFocus: false,
  })
}

// Мутации с оптимистичными обновлениями
export const useLikeVideo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (videoId: number) => api.likeVideo(videoId),
    onMutate: async (videoId) => {
      await queryClient.cancelQueries({ queryKey: ['video', videoId] })
      
      const previousVideo = queryClient.getQueryData(['video', videoId])
      
      queryClient.setQueryData(['video', videoId], (old: Video) => ({
        ...old,
        likeCount: old.likeCount + 1,
        isLiked: true,
      }))
      
      return { previousVideo }
    },
    onError: (err, videoId, context) => {
      queryClient.setQueryData(['video', videoId], context?.previousVideo)
    },
    onSettled: (videoId) => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId] })
    },
  })
}
```

## 🎨 Стилизация

### 1. Утилиты Tailwind CSS
```typescript
// Использование cn() для объединения классов
import { cn } from '@/lib/utils'

const Button = ({ variant, size, className, ...props }) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
          'border border-input hover:bg-accent': variant === 'outline',
        },
        {
          'h-10 px-4 py-2': size === 'default',
          'h-9 px-3': size === 'sm',
          'h-11 px-8': size === 'lg',
        },
        className
      )}
      {...props}
    />
  )
}
```

### 2. CSS Variables для темизации
```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... */
}
```

### 3. Responsive дизайн
```typescript
// Утилиты для работы с breakpoints
const VideoGrid = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

// Хук для определения размера экрана
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl'>('sm')
  
  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.innerWidth >= 1280) setBreakpoint('xl')
      else if (window.innerWidth >= 1024) setBreakpoint('lg')
      else if (window.innerWidth >= 768) setBreakpoint('md')
      else setBreakpoint('sm')
    }
    
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])
  
  return breakpoint
}
```

## ⚡ Оптимизация производительности

### 1. React.memo и useMemo
```typescript
// Мемоизация компонентов
const VideoCard = React.memo(({ video, onClick }) => {
  return (
    <div onClick={() => onClick(video)}>
      <img src={video.thumbnailUrl} alt={video.title} />
      <h3>{video.title}</h3>
    </div>
  )
})

// Мемоизация вычислений
const VideoList = ({ videos, searchTerm }) => {
  const filteredVideos = useMemo(() => {
    return videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [videos, searchTerm])
  
  return (
    <div>
      {filteredVideos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
```

### 2. Lazy Loading
```typescript
// Ленивая загрузка компонентов
const VideoPlayer = lazy(() => import('./VideoPlayer'))
const CommentSection = lazy(() => import('./CommentSection'))

const VideoPage = () => {
  return (
    <div>
      <Suspense fallback={<VideoPlayerSkeleton />}>
        <VideoPlayer />
      </Suspense>
      
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentSection />
      </Suspense>
    </div>
  )
}

// Ленивая загрузка изображений
const LazyImage = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef<HTMLImageElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImgSrc(src)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [src])
  
  return <img ref={imgRef} src={imgSrc} alt={alt} {...props} />
}
```

### 3. Виртуализация списков
```typescript
// Для больших списков видео
import { FixedSizeList } from 'react-window'

const VirtualizedVideoList = ({ videos }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <VideoCard video={videos[index]} />
    </div>
  )
  
  return (
    <FixedSizeList
      height={600}
      itemCount={videos.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

## 🔍 Отладка и мониторинг

### 1. React DevTools
```typescript
// Добавление displayName для компонентов
const VideoCard = ({ video }) => {
  // component logic
}
VideoCard.displayName = 'VideoCard'

// Debug информация в development
if (process.env.NODE_ENV === 'development') {
  VideoCard.whyDidYouRender = true
}
```

### 2. Error Boundaries
```typescript
class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
    // Отправка в сервис мониторинга
    reportError(error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />
    }
    
    return this.props.children
  }
}
```

### 3. Логирование
```typescript
// Централизованное логирование
class Logger {
  static info(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data)
    }
  }
  
  static error(message: string, error?: Error, data?: any) {
    console.error(`[ERROR] ${message}`, error, data)
    
    // Отправка в сервис мониторинга в production
    if (process.env.NODE_ENV === 'production') {
      this.reportToMonitoring(message, error, data)
    }
  }
  
  private static reportToMonitoring(message: string, error?: Error, data?: any) {
    // Интеграция с Sentry, LogRocket и т.д.
  }
}
```

## 📖 Следующие разделы

- [Соглашения по коду](./coding-conventions.md) - Детальные стандарты кода
- [Хуки и утилиты](./hooks-and-utils.md) - Углубленное изучение хуков
- [Формы](./forms.md) - Работа с формами и валидацией
