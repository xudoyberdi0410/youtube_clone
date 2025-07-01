# 🔌 API интеграция

Полное руководство по работе с backend API в YouTube Clone проекте.

## 📋 Обзор API архитектуры

### Основные компоненты
- **API Client** - основной клиент для взаимодействия с backend
- **API Config** - конфигурация endpoints и настроек
- **Proxy Config** - настройки прокси для CORS
- **Hooks** - React хуки для упрощения API вызовов
- **Types** - TypeScript типы для API ответов

## ⚙️ Конфигурация API

### Переменные окружения

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### API Config (`src/lib/api-config.ts`)

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  IMAGES_BASE_PATH: 'C:\\Users\\Khudoberdi\\Projects\\YouTubeCloneBackend\\images',
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/login/token',
      REFRESH: '/login/refresh_token',
    },
    USERS: {
      CREATE: '/user/post_user',
      GET_USER: '/user/get_user',
      PUT_USER: '/user/put_user',
      POST_IMAGE: '/user/post_image',
    },
    VIDEOS: {
      GET_ALL: '/video/get_all_videos',
      GET_BY_ID: '/video/get_video_by_id',
      POST_VIDEO: '/video/post_video',
      // ... другие endpoints
    }
  }
}
```

## 🔑 Авторизация

### OAuth2 Flow

```typescript
// Логин пользователя
const loginUser = async (credentials: LoginCredentials) => {
  const formData = new FormData()
  formData.append('username', credentials.username)
  formData.append('password', credentials.password)

  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
    method: 'POST',
    body: formData,
  })

  return response.json()
}
```

### Управление токенами

```typescript
// Получение заголовков авторизации
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// Обновление токенов
const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token')
  // ... логика обновления
}
```

## 📡 API Client

### Основная структура (`src/lib/api-client.ts`)

```typescript
class ApiClient {
  // Пользователи
  async getUser(userId?: number): Promise<User> { }
  async createUser(userData: UserRegistration): Promise<User> { }
  async updateUser(userData: UserUpdate): Promise<User> { }

  // Видео
  async getAllVideos(): Promise<Video[]> { }
  async getVideoById(id: number): Promise<Video> { }
  async uploadVideo(videoData: VideoUpload): Promise<Video> { }

  // Каналы
  async getChannelById(id: number): Promise<Channel> { }
  async createChannel(channelData: ChannelCreate): Promise<Channel> { }

  // Подписки
  async getSubscriptions(userId: number): Promise<Subscription[]> { }
  async subscribe(channelId: number): Promise<void> { }
  async unsubscribe(channelId: number): Promise<void> { }

  // Плейлисты
  async getPlaylists(userId: number): Promise<Playlist[]> { }
  async createPlaylist(playlistData: PlaylistCreate): Promise<Playlist> { }
  async addVideoToPlaylist(playlistId: number, videoId: number): Promise<void> { }

  // Комментарии
  async getComments(videoId: number): Promise<Comment[]> { }
  async createComment(commentData: CommentCreate): Promise<Comment> { }

  // Лайки
  async likeVideo(videoId: number): Promise<void> { }
  async unlikeVideo(videoId: number): Promise<void> { }
  async getLikes(videoId: number): Promise<Like[]> { }
}
```

### Обработка ошибок

```typescript
const handleApiError = (error: unknown): never => {
  if (error instanceof Response) {
    throw new Error(`API Error: ${error.status} ${error.statusText}`)
  }
  if (error instanceof Error) {
    throw error
  }
  throw new Error('Unknown API error occurred')
}
```

## 🎣 React Hooks для API

### useApi Hook

```typescript
// src/hooks/use-api.ts
export const useApi = () => {
  const { data: user } = useAuth()
  
  return useMemo(() => {
    return new ApiClient(user?.token)
  }, [user?.token])
}
```

### Специализированные хуки

#### useVideos
```typescript
export const useVideos = () => {
  const api = useApi()
  
  return useQuery({
    queryKey: ['videos'],
    queryFn: () => api.getAllVideos(),
    staleTime: 5 * 60 * 1000, // 5 минут
  })
}
```

#### useVideo
```typescript
export const useVideo = (videoId: number) => {
  const api = useApi()
  
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => api.getVideoById(videoId),
    enabled: !!videoId,
  })
}
```

#### useSubscriptions
```typescript
export const useSubscriptions = (userId: number) => {
  const api = useApi()
  
  return useQuery({
    queryKey: ['subscriptions', userId],
    queryFn: () => api.getSubscriptions(userId),
    enabled: !!userId,
  })
}
```

### Mutations для изменения данных

```typescript
export const useCreateVideo = () => {
  const api = useApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (videoData: VideoUpload) => api.uploadVideo(videoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}

export const useSubscribe = () => {
  const api = useApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (channelId: number) => api.subscribe(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
  })
}
```

## 📝 TypeScript типы

### API Response типы (`src/types/api.ts`)

```typescript
export interface User {
  id: number
  username: string
  email: string
  displayName?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Video {
  id: number
  title: string
  description?: string
  thumbnailUrl?: string
  videoUrl: string
  duration: number
  viewCount: number
  likeCount: number
  dislikeCount: number
  uploadedAt: string
  channelId: number
  channel: Channel
}

export interface Channel {
  id: number
  name: string
  description?: string
  avatarUrl?: string
  bannerUrl?: string
  subscriberCount: number
  videoCount: number
  createdAt: string
  userId: number
}
```

### Request типы

```typescript
export interface LoginCredentials {
  username: string
  password: string
}

export interface UserRegistration {
  username: string
  email: string
  password: string
  displayName?: string
}

export interface VideoUpload {
  title: string
  description?: string
  videoFile: File
  thumbnailFile?: File
  categoryId?: number
}
```

## 🔄 Прокси конфигурация

### Next.js API Routes (`src/app/api/proxy/route.ts`)

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  
  if (!endpoint) {
    return new Response('Missing endpoint parameter', { status: 400 })
  }

  try {
    const apiUrl = `${API_CONFIG.BASE_URL}${endpoint}`
    const response = await fetch(apiUrl, {
      headers: getProxyHeaders(request),
    })
    
    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    return new Response('Proxy error', { status: 500 })
  }
}
```

## 📊 Кеширование и оптимизация

### TanStack Query конфигурация

```typescript
// Настройка QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
})
```

### Optimistic Updates

```typescript
export const useLikeVideo = () => {
  const api = useApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (videoId: number) => api.likeVideo(videoId),
    onMutate: async (videoId) => {
      // Отменяем текущие запросы
      await queryClient.cancelQueries({ queryKey: ['video', videoId] })
      
      // Получаем текущие данные
      const previousVideo = queryClient.getQueryData(['video', videoId])
      
      // Optimistic update
      queryClient.setQueryData(['video', videoId], (old: Video) => ({
        ...old,
        likeCount: old.likeCount + 1,
      }))
      
      return { previousVideo }
    },
    onError: (err, videoId, context) => {
      // Откатываем изменения при ошибке
      queryClient.setQueryData(['video', videoId], context?.previousVideo)
    },
    onSettled: (videoId) => {
      // Обновляем данные в любом случае
      queryClient.invalidateQueries({ queryKey: ['video', videoId] })
    },
  })
}
```

## 🔧 Добавление нового API endpoint

### 1. Обновите API Config

```typescript
// src/lib/api-config.ts
ENDPOINTS: {
  // ... существующие endpoints
  COMMENTS: {
    GET_BY_VIDEO: '/comments/video',
    CREATE: '/comments',
    UPDATE: '/comments',
    DELETE: '/comments',
  }
}
```

### 2. Добавьте методы в API Client

```typescript
// src/lib/api-client.ts
async getCommentsByVideo(videoId: number): Promise<Comment[]> {
  const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.COMMENTS.GET_BY_VIDEO}/${videoId}`)
  const response = await fetch(url, {
    headers: { ...getAuthHeaders() },
  })
  
  if (!response.ok) {
    handleApiError(response)
  }
  
  return response.json()
}

async createComment(commentData: CommentCreate): Promise<Comment> {
  const url = buildApiUrl(API_CONFIG.ENDPOINTS.COMMENTS.CREATE)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(commentData),
  })
  
  if (!response.ok) {
    handleApiError(response)
  }
  
  return response.json()
}
```

### 3. Создайте типы

```typescript
// src/types/api.ts
export interface Comment {
  id: number
  content: string
  authorId: number
  author: User
  videoId: number
  createdAt: string
  updatedAt: string
  likeCount: number
  replyCount: number
}

export interface CommentCreate {
  content: string
  videoId: number
  parentId?: number // для ответов на комментарии
}
```

### 4. Создайте хуки

```typescript
// src/hooks/use-comments.ts
export const useComments = (videoId: number) => {
  const api = useApi()
  
  return useQuery({
    queryKey: ['comments', videoId],
    queryFn: () => api.getCommentsByVideo(videoId),
    enabled: !!videoId,
  })
}

export const useCreateComment = () => {
  const api = useApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (commentData: CommentCreate) => api.createComment(commentData),
    onSuccess: (newComment) => {
      queryClient.invalidateQueries({ 
        queryKey: ['comments', newComment.videoId] 
      })
    },
  })
}
```

### 5. Используйте в компонентах

```typescript
// Компонент для отображения комментариев
const CommentsSection = ({ videoId }: { videoId: number }) => {
  const { data: comments, isLoading } = useComments(videoId)
  const createComment = useCreateComment()
  
  const handleSubmit = (content: string) => {
    createComment.mutate({ content, videoId })
  }
  
  if (isLoading) return <div>Loading comments...</div>
  
  return (
    <div>
      {comments?.map(comment => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      <CommentForm onSubmit={handleSubmit} />
    </div>
  )
}
```

## 🚨 Обработка ошибок

### Глобальная обработка ошибок

```typescript
// src/lib/error-handler.ts
export const globalErrorHandler = (error: Error) => {
  console.error('API Error:', error)
  
  if (error.message.includes('401')) {
    // Перенаправляем на страницу логина
    window.location.href = '/auth/login'
  }
  
  // Показываем toast с ошибкой
  toast.error(error.message)
}

// Настройка QueryClient с глобальным обработчиком
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: globalErrorHandler,
    },
    mutations: {
      onError: globalErrorHandler,
    },
  },
})
```

### Компонент для отображения ошибок

```typescript
// src/components/ui/error-display.tsx
interface ErrorDisplayProps {
  error: Error
  retry?: () => void
}

export const ErrorDisplay = ({ error, retry }: ErrorDisplayProps) => {
  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded-md">
      <h3 className="text-red-800 font-semibold">Ошибка</h3>
      <p className="text-red-600">{error.message}</p>
      {retry && (
        <button 
          onClick={retry}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Попробовать снова
        </button>
      )}
    </div>
  )
}
```

## 📖 Следующие разделы

- [Компоненты](./components.md) - Создание и использование UI компонентов
- [Хуки и утилиты](./hooks-and-utils.md) - Подробно о кастомных хуках
- [Тестирование](./testing.md) - Тестирование API интеграции
