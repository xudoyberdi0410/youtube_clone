# 🧩 Компоненты

Подробное руководство по UI компонентам в YouTube Clone проекте.

## 📋 Обзор архитектуры компонентов

### Иерархия компонентов
```
Компоненты
├── ui/                    # Базовые компоненты (shadcn/ui)
├── layouts/               # Layout компоненты
├── domain-specific/       # Доменные компоненты (video, auth, playlist)
└── composite/             # Сложные составные компоненты
```

## 🎨 Базовые UI компоненты

### shadcn/ui компоненты (`src/components/ui/`)

Все базовые компоненты основаны на **Radix UI** и стилизованы с помощью **Tailwind CSS**.

#### Button
```typescript
// src/components/ui/button.tsx
import { ButtonHTMLAttributes, forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Button, buttonVariants }
```

#### Использование Button
```typescript
// Различные варианты кнопок
<Button variant="default">Основная</Button>
<Button variant="outline">Контурная</Button>
<Button variant="ghost">Прозрачная</Button>
<Button variant="destructive">Опасная</Button>

// Размеры
<Button size="sm">Маленькая</Button>
<Button size="default">Обычная</Button>
<Button size="lg">Большая</Button>
<Button size="icon"><Icon /></Button>

// С иконкой
<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Добавить видео
</Button>
```

#### Dialog (Модальные окна)
```typescript
// Пример использования Dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const CreatePlaylistDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Создать плейлист</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый плейлист</DialogTitle>
          <DialogDescription>
            Создайте новый плейлист для организации ваших видео
          </DialogDescription>
        </DialogHeader>
        <PlaylistForm />
      </DialogContent>
    </Dialog>
  )
}
```

## 🏗️ Layout компоненты

### BaseLayout
```typescript
// src/components/layouts/BaseLayout.tsx
import { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { Sidebar } from './Sidebar'
import { useAuth } from '@/hooks/use-auth'

interface BaseLayoutProps {
  children: ReactNode
  showSidebar?: boolean
}

export const BaseLayout = ({ children, showSidebar = true }: BaseLayoutProps) => {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

## 🎬 Video компоненты

### VideoCard
```typescript
// src/components/video/VideoCard.tsx
import { Video } from '@/types/api'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDuration, formatViewCount, formatTimeAgo } from '@/lib/utils'

interface VideoCardProps {
  video: Video
  onClick?: () => void
}

export const VideoCard = ({ video, onClick }: VideoCardProps) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="relative aspect-video">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
          {formatDuration(video.duration)}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src={video.channel.avatarUrl} />
            <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
              {video.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              {video.channel.name}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{formatViewCount(video.viewCount)} просмотров</span>
              <span>•</span>
              <span>{formatTimeAgo(video.uploadedAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### VideoPlayer
```typescript
// src/components/video/VideoPlayer.tsx
import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { PlayIcon, PauseIcon, VolumeIcon } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  poster?: string
  onTimeUpdate?: (currentTime: number) => void
}

export const VideoPlayer = ({ src, poster, onTimeUpdate }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  
  const togglePlayPause = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const time = videoRef.current.currentTime
    setCurrentTime(time)
    onTimeUpdate?.(time)
  }
  
  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }
  
  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return
    const vol = value[0]
    videoRef.current.volume = vol
    setVolume(vol)
  }
  
  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Progress Bar */}
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={handleSeek}
          className="mb-4"
        />
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={togglePlayPause}
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>
          
          <div className="flex items-center gap-2">
            <VolumeIcon className="text-white w-4 h-4" />
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>
          
          <div className="ml-auto text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  )
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
```

## 📝 Form компоненты

### Form с React Hook Form и Zod

```typescript
// src/components/forms/VideoUploadForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const videoUploadSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(100, 'Максимум 100 символов'),
  description: z.string().max(5000, 'Максимум 5000 символов').optional(),
  videoFile: z.instanceof(File, { message: 'Выберите видео файл' }),
  thumbnailFile: z.instanceof(File).optional(),
})

type VideoUploadForm = z.infer<typeof videoUploadSchema>

interface VideoUploadFormProps {
  onSubmit: (data: VideoUploadForm) => void
  isLoading?: boolean
}

export const VideoUploadForm = ({ onSubmit, isLoading }: VideoUploadFormProps) => {
  const form = useForm<VideoUploadForm>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      title: '',
      description: '',
    }
  })
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название видео</FormLabel>
              <FormControl>
                <Input placeholder="Введите название видео..." {...field} />
              </FormControl>
              <FormDescription>
                Название должно описывать содержание видео
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Расскажите о своем видео..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="videoFile"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Видео файл</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="thumbnailFile"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Превью (необязательно)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Если не выбрано, будет создано автоматически
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Загрузка...' : 'Загрузить видео'}
        </Button>
      </form>
    </Form>
  )
}
```

## 📱 Responsive компоненты

### ResponsiveGrid
```typescript
// src/components/ui/responsive-grid.tsx
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  minItemWidth?: string
}

export const ResponsiveGrid = ({ 
  children, 
  className, 
  minItemWidth = '300px' 
}: ResponsiveGridProps) => {
  return (
    <div 
      className={cn(
        'grid gap-4',
        className
      )}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}, 1fr))`
      }}
    >
      {children}
    </div>
  )
}
```

### Mobile Navigation
```typescript
// src/components/navigation/MobileNavigation.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { MenuIcon } from 'lucide-react'
import { useMobile } from '@/hooks/use-mobile'

export const MobileNavigation = () => {
  const [open, setOpen] = useState(false)
  const isMobile = useMobile()
  
  if (!isMobile) return null
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <nav className="space-y-4">
          <NavigationItems onItemClick={() => setOpen(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

## 🎯 Принципы создания компонентов

### 1. Композиция вместо наследования
```typescript
// Плохо - большой монолитный компонент
const VideoCard = ({ video, showChannel, showStats, size }) => {
  // Много условной логики...
}

// Хорошо - композируемые компоненты
const VideoCard = ({ children, video }) => (
  <Card>
    <VideoThumbnail video={video} />
    {children}
  </Card>
)

const VideoCardContent = ({ video }) => (
  <CardContent>
    <VideoTitle title={video.title} />
    <VideoStats video={video} />
  </CardContent>
)

// Использование
<VideoCard video={video}>
  <VideoCardContent video={video} />
</VideoCard>
```

### 2. Props интерфейсы
```typescript
// Четкие типизированные интерфейсы
interface VideoCardProps {
  video: Video
  onClick?: (video: Video) => void
  showChannel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Дефолтные значения
const VideoCard = ({ 
  video, 
  onClick, 
  showChannel = true, 
  size = 'md',
  className 
}: VideoCardProps) => {
  // ...
}
```

### 3. Forwarding refs
```typescript
import { forwardRef } from 'react'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("...", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### 4. Compound компоненты
```typescript
// Compound pattern для сложных компонентов
const Accordion = ({ children }) => {
  const [openItems, setOpenItems] = useState<string[]>([])
  
  return (
    <AccordionContext.Provider value={{ openItems, setOpenItems }}>
      <div className="space-y-2">{children}</div>
    </AccordionContext.Provider>
  )
}

const AccordionItem = ({ value, children }) => {
  const { openItems, setOpenItems } = useAccordionContext()
  const isOpen = openItems.includes(value)
  
  return (
    <div>
      {children}
    </div>
  )
}

Accordion.Item = AccordionItem
Accordion.Trigger = AccordionTrigger
Accordion.Content = AccordionContent

// Использование
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Заголовок</Accordion.Trigger>
    <Accordion.Content>Содержимое</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## 🧪 Тестирование компонентов

### Unit тесты для компонентов
```typescript
// src/components/video/__tests__/VideoCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { VideoCard } from '../VideoCard'
import { mockVideo } from '@/lib/test-utils'

describe('VideoCard', () => {
  it('renders video information correctly', () => {
    render(<VideoCard video={mockVideo} />)
    
    expect(screen.getByText(mockVideo.title)).toBeInTheDocument()
    expect(screen.getByText(mockVideo.channel.name)).toBeInTheDocument()
    expect(screen.getByAltText(mockVideo.title)).toBeInTheDocument()
  })
  
  it('calls onClick when card is clicked', () => {
    const onClickMock = jest.fn()
    render(<VideoCard video={mockVideo} onClick={onClickMock} />)
    
    fireEvent.click(screen.getByRole('article'))
    expect(onClickMock).toHaveBeenCalledWith(mockVideo)
  })
  
  it('formats duration correctly', () => {
    const videoWithDuration = { ...mockVideo, duration: 125 } // 2:05
    render(<VideoCard video={videoWithDuration} />)
    
    expect(screen.getByText('2:05')).toBeInTheDocument()
  })
})
```

## 📖 Следующие разделы

- [Хуки и утилиты](./hooks-and-utils.md) - Кастомные хуки
- [Добавление новых страниц](./adding-pages.md) - Создание новых routes
- [Формы](./forms.md) - Работа с формами и валидацией
