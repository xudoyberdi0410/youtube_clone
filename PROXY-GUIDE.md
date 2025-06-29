# Proxy Configuration Guide

## Обзор

Временное проксирование API запросов через Next.js для избежания CORS ошибок во время разработки. Можно легко включить/выключить через переменную окружения.

## Быстрое включение/выключение

### Включить проксирование

В файле `.env.local`:
```bash
NEXT_PUBLIC_USE_PROXY=true
```

### Выключить проксирование

В файле `.env.local`:
```bash
NEXT_PUBLIC_USE_PROXY=false
```

После изменения перезапустите сервер разработки:
```bash
bun dev
```

## Архитектура

```
Frontend (React) 
    ↓ NEXT_PUBLIC_USE_PROXY=true
Next.js API Route (/api/proxy)
    ↓
Backend API (FastAPI)
```

```
Frontend (React) 
    ↓ NEXT_PUBLIC_USE_PROXY=false
Backend API (FastAPI)
```

## Файлы системы проксирования

### 1. `src/lib/proxy-config.ts`
Конфигурация проксирования:
- Включение/выключение через переменную окружения
- URL backend сервера
- Настройки таймаутов

### 2. `src/app/api/proxy/route.ts`
Next.js API route для проксирования:
- Обработка всех HTTP методов
- Передача заголовков и данных
- Обработка FormData для загрузки файлов
- CORS заголовки

### 3. `src/lib/api-config.ts`
Обновленная конфигурация API:
- Интеграция с proxy-config
- Автоматическое переключение URL
- Поддержка proxy заголовков

## Поддерживаемые возможности

### HTTP методы
- ✅ GET - получение данных
- ✅ POST - создание записей, загрузка файлов
- ✅ PUT - обновление записей
- ✅ DELETE - удаление записей
- ✅ PATCH - частичное обновление
- ✅ OPTIONS - CORS preflight

### Типы данных
- ✅ JSON (`application/json`)
- ✅ FormData (`multipart/form-data`) - для загрузки файлов
- ✅ URL-encoded (`application/x-www-form-urlencoded`)
- ✅ Binary data (изображения, видео)

### Заголовки
- ✅ Authorization (Bearer токены)
- ✅ Content-Type
- ✅ Accept
- ✅ X-API-Key
- ✅ X-User-ID
- ✅ Кастомные заголовки

## Настройка таймаутов

В `src/lib/proxy-config.ts`:
```typescript
export const PROXY_CONFIG = {
  TIMEOUT: 30000, // 30 секунд
}
```

В `src/app/api/proxy/route.ts`:
```typescript
const FETCH_TIMEOUT = 30000 // 30 секунд
```

## Отладка

### Логи в браузере
```javascript
// В DevTools Console
console.log('Proxy enabled:', process.env.NEXT_PUBLIC_USE_PROXY)
```

### Логи на сервере
Проверьте терминал Next.js для ошибок проксирования:
```
Proxy error: [детали ошибки]
```

### Проверка запросов
В Network tab DevTools:
- **С проксированием**: `http://localhost:3000/api/proxy?endpoint=/users`
- **Без проксирования**: `https://youtube-jfmi.onrender.com/users`

## Производственная настройка

### Отключить проксирование для продакшена

В `.env.production`:
```bash
NEXT_PUBLIC_USE_PROXY=false
NEXT_PUBLIC_API_URL=https://your-production-api.com
```

### Настройка CORS на backend

Если отключаете проксирование, убедитесь что backend поддерживает CORS:

```python
# FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Ограничения

### Размер запросов
- Максимальный размер файла ограничен настройками Next.js
- По умолчанию: 4MB для API routes

### Производительность
- Дополнительный hop через Next.js сервер
- Рекомендуется только для разработки

### WebSocket
- Проксирование не поддерживает WebSocket соединения
- Для real-time функций используйте прямое подключение

## Миграция

### Удаление проксирования

1. Установите `NEXT_PUBLIC_USE_PROXY=false`
2. Настройте CORS на backend
3. При необходимости удалите файлы:
   - `src/lib/proxy-config.ts`
   - `src/app/api/proxy/route.ts`
4. Очистите `src/lib/api-config.ts` от proxy логики

### Код для удаления

В `src/lib/api-config.ts`:
```typescript
// Заменить
export const buildApiUrl = (endpoint: string): string => {
  return getApiUrl(endpoint)
}

// На
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
```

## Troubleshooting

### CORS ошибки
- Проверьте `NEXT_PUBLIC_USE_PROXY=true`
- Перезапустите сервер разработки

### Timeout ошибки
- Увеличьте `FETCH_TIMEOUT` в proxy route
- Проверьте доступность backend API

### FormData ошибки
- Убедитесь что Content-Type не устанавливается вручную для FormData
- Проверьте размер загружаемого файла

### Заголовки авторизации
- Проверьте что токен сохранен в localStorage
- Убедитесь что заголовки корректно проксируются
