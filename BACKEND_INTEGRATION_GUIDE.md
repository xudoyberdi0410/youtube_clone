# Интеграция с Backend API

## Обзор изменений

Главная страница YouTube Clone теперь загружает видео с бэкенда через API вместо использования мок-данных.

## Ключевые изменения

### 1. Новые файлы

#### `src/lib/utils/video-mapper.ts`
- Утилита для преобразования данных из API формата в формат компонентов
- Функции форматирования времени, длительности и количества подписчиков
- Обработка различий в структуре данных между API и UI

#### `src/hooks/use-videos.ts`
- Хук для загрузки видео с бэкенда
- Поддержка фильтрации по категориям
- Управление состояниями загрузки и ошибок
- Функции для обновления данных

#### `src/modules/home/ui/components/home-videos/empty-state.tsx`
- Компонент для отображения пустого состояния
- Показывается когда видео не найдены в выбранной категории

### 2. Обновленные файлы

#### `src/modules/home/ui/components/home-videos/index.tsx`
- Убраны мок-данные
- Интегрирован хук `useVideos`
- Добавлена обработка ошибок
- Добавлено отображение пустого состояния

#### `src/modules/home/ui/components/home-videos/video-filters.tsx`
- Обновлены категории для соответствия API
- Добавлен коллбек `onCategoryChange`
- Переведены названия категорий на русский язык

#### `src/hooks/index.ts`
- Добавлен экспорт нового хука `useVideos`

## Функциональность

### Загрузка видео
- Автоматическая загрузка видео при открытии страницы
- Отображение скелетонов во время загрузки
- Обработка ошибок с возможностью повторной загрузки

### Фильтрация по категориям
- Поддержка всех категорий из API
- Мгновенное обновление списка при смене категории
- Кнопка "All" для показа всех видео

### Обработка ошибок
- Уведомления об ошибках загрузки
- Кнопка для повторной попытки
- Graceful degradation при проблемах с API

### Пустое состояние
- Информативное сообщение когда видео не найдены
- Визуальные индикаторы для лучшего UX
- Возможность обновления данных

## API Endpoints

Используется endpoint `/video/get_video` с параметрами:
- `category` - фильтрация по категории (опционально)
- `ident` - идентификатор для пагинации (опционально)

## Типы данных

### API формат (Video)
```typescript
interface Video {
  id: number
  title: string
  description: string
  category: VideoCategory
  channel_id: number
  video_url: string
  thumbnail_url?: string
  views_count: number
  likes_count: number
  dislikes_count: number
  duration?: number
  created_at: string
  updated_at?: string
  channel?: Channel
}
```

### UI формат (Video)
```typescript
interface Video {
  id: string
  title: string
  description?: string
  views: number
  likes?: number
  dislikes?: number
  channel: Channel
  preview: string
  videoUrl?: string
  duration: string
  uploadedAt: string
  // ... другие поля
}
```

## Конфигурация

Используются настройки из `.env.local`:
- `NEXT_PUBLIC_API_URL` - URL бэкенда
- `NEXT_PUBLIC_USE_PROXY` - использование прокси для CORS

## Следующие шаги

1. Добавить пагинацию для больших списков видео
2. Реализовать поиск видео
3. Добавить кэширование данных
4. Оптимизация загрузки изображений
5. Добавить индикаторы verified для каналов
