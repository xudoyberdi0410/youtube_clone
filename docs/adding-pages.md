# 📄 Добавление новых страниц

Подробное руководство по созданию новых страниц в YouTube Clone проекте с использованием Next.js App Router.

## 🗺️ App Router структура

Next.js App Router использует файловую систему для маршрутизации. Каждая папка в `src/app` представляет сегмент маршрута.

### Основные файлы маршрутов

- **`page.tsx`** - Основной компонент страницы
- **`layout.tsx`** - Layout для группы страниц
- **`loading.tsx`** - Компонент загрузки
- **`error.tsx`** - Компонент ошибки
- **`not-found.tsx`** - Страница 404

## 📋 Пошаговое создание новой страницы

### Пример: Создание страницы "Trending"

#### 1. Создание структуры папок

```
src/app/
├── trending/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx
```

#### 2. Основная страница (`page.tsx`)

```typescript
// src/app/trending/page.tsx
import { Metadata } from 'next'
import { TrendingPage } from '@/modules/trending/components/TrendingPage'

export const metadata: Metadata = {
  title: 'В тренде',
  description: 'Популярные видео на YouTube Clone',
  keywords: ['тренды', 'популярное', 'видео'],
}

export default function Trending() {
  return <TrendingPage />
}
```

#### 3. Layout для страницы (`layout.tsx`)

```typescript
// src/app/trending/layout.tsx
import { ReactNode } from 'react'
import { BaseLayout } from '@/components/layouts/BaseLayout'

interface TrendingLayoutProps {
  children: ReactNode
}

export default function TrendingLayout({ children }: TrendingLayoutProps) {
  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">В тренде</h1>
          <p className="text-muted-foreground mt-2">
            Самые популярные видео сегодня
          </p>
        </header>
        {children}
      </div>
    </BaseLayout>
  )
}
```

#### 4. Loading состояние (`loading.tsx`)

```typescript
// src/app/trending/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsiveGrid } from '@/components/ui/responsive-grid'

export default function TrendingLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <ResponsiveGrid>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </ResponsiveGrid>
    </div>
  )
}
```

#### 5. Error boundary (`error.tsx`)

```typescript
// src/app/trending/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function TrendingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Trending page error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <AlertTriangle className="h-16 w-16 text-destructive" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Что-то пошло не так</h2>
        <p className="text-muted-foreground max-w-md">
          Не удалось загрузить популярные видео. Пожалуйста, попробуйте еще раз.
        </p>
      </div>
      <Button onClick={reset}>Попробовать снова</Button>
    </div>
  )
}
```

## 🏗️ Создание модуля для страницы

### 1. Структура модуля

```
src/modules/trending/
├── components/
│   ├── TrendingPage.tsx
│   ├── TrendingFilters.tsx
│   └── TrendingGrid.tsx
├── hooks/
│   └── use-trending.ts
├── types/
│   └── trending.ts
└── utils/
    └── trending-utils.ts
```

### 2. Основной компонент страницы

```typescript
// src/modules/trending/components/TrendingPage.tsx
'use client'

import { useState } from 'react'
import { TrendingFilters } from './TrendingFilters'
import { TrendingGrid } from './TrendingGrid'
import { useTrending } from '../hooks/use-trending'

export const TrendingPage = () => {
  const [category, setCategory] = useState<string>('all')
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today')
  
  const { 
    data: videos, 
    isLoading, 
    error 
  } = useTrending({ category, timeframe })

  if (error) {
    throw error // Будет поймано error.tsx
  }

  return (
    <div className="space-y-6">
      <TrendingFilters
        category={category}
        onCategoryChange={setCategory}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
      />
      
      <TrendingGrid videos={videos} isLoading={isLoading} />
    </div>
  )
}
```

### 3. Хук для данных

```typescript
// src/modules/trending/hooks/use-trending.ts
import { useQuery } from '@tanstack/react-query'
import { useApi } from '@/hooks/use-api'

interface UseTrendingOptions {
  category: string
  timeframe: 'today' | 'week' | 'month'
}

export const useTrending = ({ category, timeframe }: UseTrendingOptions) => {
  const api = useApi()
  
  return useQuery({
    queryKey: ['trending', category, timeframe],
    queryFn: () => api.getTrendingVideos({ category, timeframe }),
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false,
  })
}
```

## 🌐 Динамические маршруты

### Пример: Страница профиля пользователя

#### Структура
```
src/app/user/
├── [username]/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── videos/
│   │   └── page.tsx
│   ├── playlists/
│   │   └── page.tsx
│   └── about/
│       └── page.tsx
```

#### Динамическая страница

```typescript
// src/app/user/[username]/page.tsx
import { Metadata } from 'next'
import { UserProfilePage } from '@/modules/user/components/UserProfilePage'
import { api } from '@/lib/api-client'

interface UserPageProps {
  params: { username: string }
  searchParams: { tab?: string }
}

// Генерация метаданных на основе username
export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  try {
    const user = await api.getUserByUsername(params.username)
    
    return {
      title: `${user.displayName} (@${user.username})`,
      description: user.bio || `Профиль пользователя ${user.displayName}`,
      openGraph: {
        title: user.displayName,
        description: user.bio,
        images: user.avatarUrl ? [user.avatarUrl] : [],
      },
    }
  } catch {
    return {
      title: 'Пользователь не найден',
      description: 'Запрашиваемый профиль пользователя не существует',
    }
  }
}

export default function UserPage({ params, searchParams }: UserPageProps) {
  return (
    <UserProfilePage 
      username={params.username} 
      activeTab={searchParams.tab || 'videos'}
    />
  )
}
```

#### Layout для пользователя

```typescript
// src/app/user/[username]/layout.tsx
import { ReactNode } from 'react'
import { UserProfileHeader } from '@/modules/user/components/UserProfileHeader'
import { UserNavigation } from '@/modules/user/components/UserNavigation'

interface UserLayoutProps {
  children: ReactNode
  params: { username: string }
}

export default function UserLayout({ children, params }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <UserProfileHeader username={params.username} />
      <UserNavigation username={params.username} />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
```

## 🔗 Параллельные маршруты

### Пример: Dashboard с несколькими секциями

```
src/app/dashboard/
├── layout.tsx
├── page.tsx
├── @analytics/
│   ├── page.tsx
│   └── loading.tsx
├── @videos/
│   ├── page.tsx
│   └── loading.tsx
└── @comments/
    ├── page.tsx
    └── loading.tsx
```

```typescript
// src/app/dashboard/layout.tsx
import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
  analytics: ReactNode
  videos: ReactNode
  comments: ReactNode
}

export default function DashboardLayout({
  children,
  analytics,
  videos,
  comments,
}: DashboardLayoutProps) {
  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      <div className="col-span-12">
        {children}
      </div>
      <div className="col-span-4">
        {analytics}
      </div>
      <div className="col-span-4">
        {videos}
      </div>
      <div className="col-span-4">
        {comments}
      </div>
    </div>
  )
}
```

## 🛡️ Защищенные маршруты

### Middleware для аутентификации

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  // Защищенные маршруты
  const protectedPaths = ['/dashboard', '/upload', '/settings', '/feed']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (token && !verifyToken(token)) {
    // Токен недействителен
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    response.cookies.delete('access_token')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### Компонент для защищенных страниц

```typescript
// src/components/auth/AuthGuard.tsx
'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login' 
}: AuthGuardProps) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      router.push(redirectTo)
    }
  }, [user, isLoading, requireAuth, redirectTo, router])

  if (isLoading) {
    return <AuthGuardSkeleton />
  }

  if (requireAuth && !user) {
    return null // Перенаправление происходит в useEffect
  }

  return <>{children}</>
}

const AuthGuardSkeleton = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-64" />
    <Skeleton className="h-32 w-full" />
  </div>
)
```

## 🎯 SEO и метаданные

### Статические метаданные

```typescript
// src/app/about/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'О нас | YouTube Clone',
  description: 'Узнайте больше о YouTube Clone - современной платформе для видео',
  keywords: ['о нас', 'youtube clone', 'видео платформа'],
  openGraph: {
    title: 'О нас | YouTube Clone',
    description: 'Современная платформа для видео',
    images: ['/og-about.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'О нас | YouTube Clone',
    description: 'Современная платформа для видео',
    images: ['/og-about.jpg'],
  },
}
```

### Динамические метаданные

```typescript
// src/app/watch/page.tsx
export async function generateMetadata({ searchParams }: {
  searchParams: { v?: string }
}): Promise<Metadata> {
  const videoId = searchParams.v
  
  if (!videoId) {
    return { title: 'Видео не найдено' }
  }

  try {
    const video = await api.getVideoById(parseInt(videoId))
    
    return {
      title: `${video.title} | YouTube Clone`,
      description: video.description || `Смотрите видео "${video.title}" на YouTube Clone`,
      openGraph: {
        title: video.title,
        description: video.description,
        images: video.thumbnailUrl ? [video.thumbnailUrl] : [],
        videos: [
          {
            url: video.videoUrl,
            type: 'video/mp4',
          },
        ],
      },
    }
  } catch {
    return { title: 'Видео не найдено' }
  }
}
```

## 📱 Адаптивность и мобильная версия

### Responsive Layout

```typescript
// src/app/mobile-layout.tsx
'use client'

import { ReactNode } from 'react'
import { useMobile } from '@/hooks/use-mobile'
import { MobileNavigation } from '@/components/navigation/MobileNavigation'
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar'

interface AdaptiveLayoutProps {
  children: ReactNode
}

export const AdaptiveLayout = ({ children }: AdaptiveLayoutProps) => {
  const isMobile = useMobile()

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileNavigation /> : <DesktopSidebar />}
      <main className={`${isMobile ? 'pt-16' : 'ml-64'} transition-all duration-300`}>
        {children}
      </main>
    </div>
  )
}
```

## 🚀 Оптимизация производительности

### Ленивая загрузка компонентов

```typescript
// src/app/heavy-page/page.tsx
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Ленивая загрузка тяжелого компонента
const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  {
    loading: () => <Skeleton className="h-96 w-full" />,
    ssr: false, // Отключить SSR для этого компонента
  }
)

export default function HeavyPage() {
  return (
    <div>
      <h1>Страница с тяжелым компонентом</h1>
      <HeavyComponent />
    </div>
  )
}
```

### Streaming с Suspense

```typescript
// src/app/stream-example/page.tsx
import { Suspense } from 'react'
import { VideoList } from '@/components/video/VideoList'
import { UserInfo } from '@/components/user/UserInfo'
import { Skeleton } from '@/components/ui/skeleton'

export default function StreamPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <UserInfo />
      </Suspense>
      
      <Suspense fallback={<VideoListSkeleton />}>
        <VideoList />
      </Suspense>
    </div>
  )
}

const VideoListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="aspect-video" />
    ))}
  </div>
)
```

## 📖 Следующие разделы

- [Создание компонентов](./creating-components.md) - Разработка UI компонентов
- [Формы](./forms.md) - Работа с формами и валидацией
- [Руководство по разработке](./development-guide.md) - Общие принципы разработки
