# API Configuration & Client

Этот документ описывает новую архитектуру для работы с API в YouTube Clone проекте.

## Структура

### 📁 `/src/lib/`
- `api-config.ts` - Конфигурация API endpoints и настроек
- `api-client.ts` - Универсальный HTTP клиент для всех API запросов

### 📁 `/src/types/`
- `auth.ts` - Типы для аутентификации и пользователей

### 📁 `/src/modules/auth/lib/`
- `auth-utils.ts` - Функции для работы с аутентификацией

## Конфигурация API

### Основные настройки (`api-config.ts`)

```typescript
// Временная конфигурация для локальной разработки
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  IMAGES_BASE_PATH: 'C:\\Users\\Khudoberdi\\Projects\\YouTubeCloneBackend\\images',
  // ... endpoints
}
```

### Настройка для Production

Когда бэкенд будет готов, нужно:

1. **Добавить в FastAPI раздачу статических файлов:**
```python
from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

2. **Обновить endpoints в `api-config.ts`:**
```typescript
ENDPOINTS: {
  AUTH: {
    LOGIN: '/auth/login',    // вместо '/login/token'
    REGISTER: '/auth/register', // вместо '/post_user'
    // ...
  }
}
```

3. **Обновить пути к изображениям:**
```typescript
// Убрать временную логику для локальных файлов
// Использовать только buildImageUrl() helper
```

## Использование API Client

### Примеры запросов

```typescript
import { apiClient } from '@/lib/api-client'

// GET запрос
const users = await apiClient.get<User[]>('/users')

// POST с JSON
const user = await apiClient.post<User>('/users', { name: 'John' })

// POST с FormData (загрузка файлов)
const formData = new FormData()
formData.append('file', file)
const result = await apiClient.postFormData('/upload', formData)

// POST с form-urlencoded (OAuth2 login)
const tokens = await apiClient.postFormUrlencoded('/login', {
  username: 'user@example.com',
  password: 'secret'
})
```

### Обработка ошибок

```typescript
try {
  const result = await apiClient.get('/protected-endpoint')
} catch (error) {
  if (error instanceof ApiError) {
    console.log('Status:', error.status)
    console.log('Message:', error.message)
    console.log('Details:', error.details)
  }
}
```

## Аватары и изображения

### Текущая логика (временная)

Для локальной разработки без настроенного бэкенда:
- Изображения сохраняются в `C:\Users\Khudoberdi\Projects\YouTubeCloneBackend\images`
- URL формируется как `file:///C:/Users/...`

### Будущая логика (Production)

После настройки бэкенда:
- Изображения будут доступны по `/uploads/avatars/filename.jpg`
- URL будет формироваться как `http://localhost:8000/uploads/avatars/filename.jpg`

### Использование

```typescript
import { getAvatarUrl } from '@/modules/auth/lib/auth-utils'

// Автоматически определяет правильный URL
const avatarUrl = getAvatarUrl(user, '?t=' + Date.now())
```

## Endpoints

### Текущие (временные)
- `POST /login/token` - Авторизация
- `POST /post_user` - Регистрация  
- `GET /get_own_lock` - Получить текущего пользователя
- `PUT /put_own` - Обновить профиль
- `POST /load_image` - Загрузить аватар
- `DELETE /delete_own` - Удалить аккаунт

### Планируемые (стандартные REST)
- `POST /auth/login` - Авторизация
- `POST /auth/register` - Регистрация
- `GET /auth/me` - Получить текущего пользователя  
- `PUT /users/me` - Обновить профиль
- `POST /users/me/avatar` - Загрузить аватар
- `DELETE /users/me` - Удалить аккаунт

## Как изменить настройки

### 1. Изменить базовый URL
```typescript
// В api-config.ts
BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
```

### 2. Добавить новый endpoint
```typescript
// В api-config.ts
ENDPOINTS: {
  VIDEOS: {
    GET_ALL: '/videos',
    GET_BY_ID: (id: string) => `/videos/${id}`,
  }
}
```

### 3. Добавить новую API функцию
```typescript
// В соответствующем модуле
export async function getVideos(): Promise<Video[]> {
  return apiClient.get<Video[]>(API_CONFIG.ENDPOINTS.VIDEOS.GET_ALL)
}
```

## Environment Variables

Создайте `.env.local` файл:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## TODO для Production

- [ ] Настроить StaticFiles в FastAPI
- [ ] Обновить все endpoints на стандартные REST
- [ ] Удалить временную логику для локальных файлов
- [ ] Добавить middleware для автоматического refresh токенов
- [ ] Добавить retry логику для API запросов
- [ ] Настроить CORS на бэкенде
