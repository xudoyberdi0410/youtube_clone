# API Client Guide

## Overview

Обновленный TypeScript API клиент для проекта YouTube clone предоставляет полностью типизированный интерфейс для взаимодействия с backend API. Клиент покрывает все endpoints и использует строгую типизацию для безопасности типов.

## Features

- ✅ **Полная типизация** - все методы используют TypeScript типы из `src/types/api.ts`
- ✅ **Singleton pattern** - единственный экземпляр клиента во всем приложении
- ✅ **Обработка ошибок** - специальный класс `ApiError` для API ошибок
- ✅ **Поддержка FormData** - для загрузки файлов (видео, изображения)
- ✅ **Автоматическая авторизация** - заголовки авторизации добавляются автоматически

## Usage

### Импорт

```typescript
import { apiClient } from '@/lib/api-client'
import type { User, Video, Channel } from '@/types/api'
```

### User API

```typescript
// Регистрация пользователя
const user: User = await apiClient.registerUser({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123'
})

// Получение данных пользователя
const currentUser: User = await apiClient.getUser()

// Обновление пользователя
const updatedUser: User = await apiClient.updateUser({
  username: 'john_doe_updated',
  email: 'john.updated@example.com',
  password: 'newpassword123'
})

// Загрузка аватара
const imageFile = new File(['...'], 'avatar.jpg', { type: 'image/jpeg' })
await apiClient.uploadUserAvatar(imageFile)
```

### Channel API

```typescript
// Создание канала
const channel: Channel = await apiClient.createChannel({
  name: 'My Channel',
  description: 'Channel description'
})

// Получение моего канала
const myChannel: Channel = await apiClient.getMyChannel()

// Получение публичного канала
const publicChannel: Channel = await apiClient.getChannel('channel-name')

// Загрузка изображений канала
const profileImage = new File(['...'], 'profile.jpg', { type: 'image/jpeg' })
await apiClient.uploadChannelProfileImage(profileImage)

const bannerImage = new File(['...'], 'banner.jpg', { type: 'image/jpeg' })
await apiClient.uploadChannelBannerImage(bannerImage)
```

### Video API

```typescript
// Загрузка видео
const videoFile = new File(['...'], 'video.mp4', { type: 'video/mp4' })
const video: Video = await apiClient.uploadVideo(videoFile, {
  title: 'My Video',
  description: 'Video description',
  category: 'Texnologiya'
})

// Получение видео
const videos: Video[] = await apiClient.getVideos()
const myVideos: Video[] = await apiClient.getMyVideos()

// Получение видео по категории
const techVideos: Video[] = await apiClient.getVideos(undefined, 'Texnologiya')

// Обновление видео
const updatedVideo: Video = await apiClient.updateVideo({
  title: 'Updated Title',
  description: 'Updated description',
  category: 'Musiqa'
})
```

### Likes & Comments

```typescript
// Поставить лайк
const like: Like = await apiClient.addLike({
  video_id: 1,
  is_like: true
})

// Получить лайки
const likes: Like[] = await apiClient.getLikes()

// Добавить комментарий
const comment: Comment = await apiClient.addComment({
  video_id: 1,
  comment: 'Great video!'
})

// Получить комментарии
const comments: Comment[] = await apiClient.getComments()
```

### Subscriptions

```typescript
// Подписаться на канал
const subscription: Subscription = await apiClient.subscribe({
  channel_id: 1
})

// Получить подписки
const subscriptions: Subscription[] = await apiClient.getSubscriptions()

// Получить подписчиков
const subscribers: Subscription[] = await apiClient.getSubscribers()
```

### Playlists

```typescript
// Создать плейлист
const playlist: Playlist = await apiClient.createPlaylist({
  name: 'My Playlist',
  description: 'Playlist description'
})

// Получить плейлисты
const playlists: Playlist[] = await apiClient.getPlaylists()
const myPlaylists: Playlist[] = await apiClient.getMyPlaylists()

// Добавить видео в плейлист
const playlistVideo: PlaylistVideo = await apiClient.addVideoToPlaylist({
  playlist_id: 1,
  video_id: 1
})
```

### Shorts

```typescript
// Загрузка Shorts
const shortsFile = new File(['...'], 'shorts.mp4', { type: 'video/mp4' })
const shorts: Shorts = await apiClient.uploadShorts(shortsFile, {
  title: 'My Shorts',
  description: 'Shorts description',
  category: 'Ko\'ngilochar'
})

// Получить Shorts
const allShorts: Shorts[] = await apiClient.getShorts()
```

### Authentication

```typescript
// Логин
const token: TokenResponse = await apiClient.login({
  username: 'john_doe',
  password: 'password123'
})

// Обновление токена
const newToken: TokenResponse = await apiClient.refreshToken('refresh_token_here')
```

## Error Handling

```typescript
import { ApiError } from '@/lib/api-client'

try {
  const user = await apiClient.getUser()
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message)
    console.error('Status:', error.status)
    console.error('Details:', error.details)
  } else {
    console.error('Network Error:', error)
  }
}
```

## Video Categories

Доступные категории видео:

- `'Musiqa'` - Музыка
- `"Ta'lim"` - Образование
- `'Texnologiya'` - Технологии
- `"O'yinlar"` - Игры
- `'Yangiliklar'` - Новости
- `"Ko'ngilochar"` - Развлечения
- `'Sport'` - Спорт
- `'Ilm-fan va Tabiat'` - Наука и природа
- `'Sayohat'` - Путешествия
- `'Oshxona va Pazandachilik'` - Кулинария
- `"Moda va Go'zallik"` - Мода и красота
- `'Biznes'` - Бизнес
- `'Motivatsiya'` - Мотивация
- `'Filmlar'` - Фильмы
- `'Seriallar'` - Сериалы
- `'Avtomobillar'` - Автомобили
- `'Hayvonlar'` - Животные
- `'Siyosat'` - Политика

## Configuration

API клиент использует конфигурацию из `src/lib/api-config.ts`:

- `buildApiUrl()` - построение URL для API endpoints с поддержкой проксирования
- `getAuthHeaders()` - получение заголовков авторизации

### Проксирование запросов ✅

Для избежания CORS ошибок во время разработки добавлено временное проксирование через Next.js API routes. **Система настроена и работает!**

#### Включение/выключение проксирования

В файле `.env.local`:

```bash
# Включить проксирование (рекомендуется для разработки)
NEXT_PUBLIC_USE_PROXY=true

# Выключить проксирование (прямые запросы к API)
NEXT_PUBLIC_USE_PROXY=false
```

#### Тестирование

1. **Автоматическое тестирование**: http://localhost:3000/test
2. **Консольное тестирование**: 
   ```javascript
   testProxy() // В консоли браузера
   ```

#### Подтвержденные работающие endpoints

- ✅ `POST /login/token` - OAuth2 логин (form-urlencoded)
- ✅ `GET /user/get_user` - получение пользователя
- ✅ `PUT /user/put_user` - обновление пользователя  
- ✅ `POST /user/post_image` - загрузка изображения
- ✅ `POST /post_user` - регистрация пользователя

#### Как работает проксирование

1. **Включено** (`NEXT_PUBLIC_USE_PROXY=true`):
   - Все API запросы идут через `/api/proxy`
   - Next.js сервер проксирует запросы к backend
   - Нет CORS ошибок
   - Все заголовки и данные передаются корректно

2. **Выключено** (`NEXT_PUBLIC_USE_PROXY=false`):
   - Прямые запросы к backend API
   - Требует настройки CORS на backend
   - Производственный режим

#### Поддерживаемые возможности

- ✅ Все HTTP методы (GET, POST, PUT, DELETE, PATCH)
- ✅ JSON данные
- ✅ FormData (загрузка файлов)
- ✅ URL-encoded данные
- ✅ Передача всех заголовков авторизации
- ✅ Обработка ошибок и таймаутов
- ✅ CORS заголовки

#### Настройка проксирования

Конфигурация в `src/lib/proxy-config.ts`:

```typescript
export const PROXY_CONFIG = {
  ENABLED: process.env.NEXT_PUBLIC_USE_PROXY === 'true',
  BACKEND_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  PROXY_PATH: '/api/proxy',
  TIMEOUT: 30000, // 30 секунд
}
```

## Testing

Клиент покрыт unit тестами в `src/__tests__/api-client.test.ts`, которые проверяют:

- Корректность типов возвращаемых значений
- Обработку ошибок
- Singleton pattern
- Мокирование HTTP запросов

Для запуска тестов:

```bash
bun test api-client.test.ts
```
