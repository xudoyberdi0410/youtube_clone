# Руководство по эндпоинтам API

## Централизованное управление эндпоинтами

Все эндпоинты API теперь централизованно управляются через файл `src/lib/api-config.ts`. Это позволяет изменить любой эндпоинт в одном месте, и изменение автоматически применится во всем проекте.

## Структура конфигурации

```typescript
// src/lib/api-config.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/login/token',
      REFRESH: '/login/refresh_token',
      LOGOUT: '/auth/logout',
    },
    USERS: {
      GET_OWN: '/get_own_lock',
      GET_ALL: '/get_all_users',
      CREATE: '/post_user',
      UPDATE_OWN: '/put_own',
      UPLOAD_AVATAR: '/load_image',
      DELETE_ACCOUNT: '/delete_self',
    },
    VIDEOS: {
      GET_ALL: '/videos',
      GET_BY_ID: (id: string) => `/videos/${id}`,
      // ... и другие
    }
  }
}
```

## Способы использования эндпоинтов

### 1. Прямое обращение к конфигурации (рекомендуется)

```typescript
import { API_CONFIG } from '@/lib/api-config'

// Использование в API вызовах
await apiClient.get(API_CONFIG.ENDPOINTS.USERS.GET_OWN)
await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data)
```

### 2. Через helper функции (альтернативный способ)

```typescript
import { getEndpoint } from '@/lib/api-config'

// Более читаемый синтаксис
await apiClient.get(getEndpoint.users.getOwn())
await apiClient.post(getEndpoint.auth.login(), data)

// Для динамических эндпоинтов
await apiClient.get(getEndpoint.videos.getById('123'))
```

## Изменение эндпоинтов

Чтобы изменить эндпоинт, нужно отредактировать только файл `src/lib/api-config.ts`:

### Пример: Изменение эндпоинта логина

**Было:**
```typescript
AUTH: {
  LOGIN: '/login/token',
}
```

**Стало:**
```typescript
AUTH: {
  LOGIN: '/auth/login', // Новый эндпоинт
}
```

После этого изменения все вызовы в проекте автоматически будут использовать новый эндпоинт.

## Файлы, которые используют централизованную конфигурацию

- `src/modules/auth/lib/auth-utils.ts` - основной файл для работы с авторизацией
- `src/lib/api-client.ts` - базовый HTTP клиент
- Все компоненты, которые делают API вызовы

## Устаревшие файлы

- `src/modules/auth/lib/auth-utils-simple.ts` - содержит хардкодные эндпоинты, рекомендуется к удалению

## Преимущества централизованного подхода

1. **Единое место изменений** - изменяешь эндпоинт в одном файле
2. **Типобезопасность** - TypeScript поможет найти ошибки
3. **Автодополнение** - IDE подскажет доступные эндпоинты
4. **Легкость рефакторинга** - можно быстро найти все использования
5. **Документированность** - все эндпоинты видны в одном месте

## Добавление новых эндпоинтов

Чтобы добавить новый эндпоинт:

1. Добавьте его в `API_CONFIG.ENDPOINTS` в соответствующую секцию
2. Если нужно, добавьте helper функцию в `getEndpoint`
3. Используйте в коде через `API_CONFIG.ENDPOINTS.*` или `getEndpoint.*`

### Пример добавления нового эндпоинта

```typescript
// В api-config.ts
USERS: {
  // ... существующие эндпоинты
  SEARCH: '/users/search', // Новый эндпоинт
  GET_PROFILE: (username: string) => `/users/profile/${username}`, // Динамический эндпоинт
}

// В getEndpoint helper'е
users: {
  // ... существующие функции
  search: () => API_CONFIG.ENDPOINTS.USERS.SEARCH,
  getProfile: (username: string) => API_CONFIG.ENDPOINTS.USERS.GET_PROFILE(username),
}
```

## Миграция существующего кода

Если найдете хардкодные эндпоинты в коде:

```typescript
// ❌ Старый способ
await fetch('http://localhost:8000/get_own_lock')

// ✅ Новый способ
import { API_CONFIG } from '@/lib/api-config'
await apiClient.get(API_CONFIG.ENDPOINTS.USERS.GET_OWN)
```
