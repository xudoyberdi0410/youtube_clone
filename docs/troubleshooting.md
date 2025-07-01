# 🛠️ Troubleshooting

Решение частых проблем и ошибок при работе с YouTube Clone проектом.

## 🚀 Проблемы с установкой и запуском

### Ошибки при установке зависимостей

#### `bun install` завершается с ошибкой
```bash
# Проблема: конфликт зависимостей
Error: Could not resolve dependency

# Решение 1: Очистка кэша
bun pm cache rm
rm -rf node_modules bun.lockb
bun install

# Решение 2: Использование npm вместо bun
npm install

# Решение 3: Принудительная установка
bun install --force
```

#### Ошибки с peer dependencies
```bash
# Проблема: несовместимые версии пакетов
WARN: peer dep missing

# Решение: установка недостающих пакетов
bun add react@^19.0.0 react-dom@^19.0.0

# Проверка совместимости
bun pm ls
```

### Проблемы с запуском dev сервера

#### Порт уже используется
```bash
# Ошибка
Error: Port 3000 is already in use

# Решения:
# 1. Использовать другой порт
bun dev -p 3001

# 2. Найти и завершить процесс (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# 3. Найти и завершить процесс (macOS/Linux)
lsof -ti:3000 | xargs kill
```

#### TypeScript ошибки при запуске
```bash
# Проблема: устаревшие типы или конфликты
Type error: Cannot find module '@/components/ui/button'

# Решения:
# 1. Проверить пути в tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# 2. Перезапустить TypeScript сервер в VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# 3. Очистить кэш Next.js
rm -rf .next
bun dev
```

## 🎨 Проблемы со стилизацией

### Tailwind CSS не работает

#### Стили не применяются
```bash
# Проблема: Tailwind не загружается

# Проверить конфигурацию tailwind.config.ts
content: [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './src/**/*.{js,ts,jsx,tsx,mdx}', // Убедитесь что src включен
]

# Проверить импорт в globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

# Перезапуск dev сервера
bun dev
```

#### Классы Tailwind не распознаются в VS Code
```json
// .vscode/settings.json
{
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### CSS-in-JS конфликты
```typescript
// Проблема: конфликт стилей между компонентами

// Решение: использование CSS Modules или Styled Components
// styles.module.css
.button {
  background: blue;
}

// Component.tsx
import styles from './styles.module.css'
<button className={styles.button}>Button</button>
```

## 🔌 API проблемы

### CORS ошибки

#### Blocked by CORS policy
```typescript
// Проблема:
Access to fetch at 'http://localhost:8000/api/videos' 
from origin 'http://localhost:3000' has been blocked by CORS policy

// Решение 1: Настройка прокси в next.config.ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ]
  },
}

// Решение 2: Использование API Routes
// src/app/api/proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  
  const response = await fetch(`http://localhost:8000${endpoint}`, {
    headers: {
      'Authorization': request.headers.get('Authorization') || '',
    },
  })
  
  return Response.json(await response.json())
}
```

### Проблемы с аутентификацией

#### Токен истек
```typescript
// Проблема: 401 Unauthorized

// Решение: автоматическое обновление токена
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (refreshToken) {
        try {
          const response = await refreshAccessToken(refreshToken)
          localStorage.setItem('access_token', response.access_token)
          
          // Повторить оригинальный запрос
          return api.request(error.config)
        } catch (refreshError) {
          // Перенаправить на логин
          window.location.href = '/auth/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)
```

#### Бесконечные редиректы при авторизации
```typescript
// Проблема: middleware перенаправляет в цикле

// middleware.ts - исправление
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl
  
  // Исключаем API routes и статические файлы
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/auth/') // Важно: исключить auth pages
  ) {
    return NextResponse.next()
  }
  
  const protectedPaths = ['/dashboard', '/upload', '/settings']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  return NextResponse.next()
}
```

## 📱 Проблемы с responsiveness

### Компоненты не адаптивны
```typescript
// Проблема: фиксированные размеры

// Плохо
<div className="w-400 h-300">Content</div>

// Хорошо
<div className="w-full max-w-md h-auto">Content</div>

// Использование breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Item key={item.id} />)}
</div>
```

### Hydration ошибки на мобильных
```typescript
// Проблема: различия между SSR и клиентским рендерингом

// Решение: использование dynamic import для клиентских компонентов
import dynamic from 'next/dynamic'

const MobileOnlyComponent = dynamic(
  () => import('./MobileOnlyComponent'),
  { ssr: false }
)

// Или проверка на клиенте
const [isMounted, setIsMounted] = useState(false)

useEffect(() => {
  setIsMounted(true)
}, [])

if (!isMounted) {
  return <ServerSideSkeleton />
}
```

## 🧪 Проблемы с тестированием

### Тесты падают с ошибками

#### Mock ошибки
```typescript
// Проблема: модули не мокаются правильно

// jest.setup.js - добавить мокирование
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}))
```

#### Testing Library ошибки
```typescript
// Проблема: элементы не находятся

// Плохо
screen.getByText('Submit') // может не найти кнопку

// Хорошо
screen.getByRole('button', { name: /submit/i })

// Для асинхронных элементов
await screen.findByText('Success message')

// Если элемент может отсутствовать
const element = screen.queryByText('Optional text')
expect(element).toBeNull()
```

#### React Query в тестах
```typescript
// Проблема: тесты зависают из-за React Query

// test-utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Infinity,
    },
  },
})

export const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}
```

## 🚀 Проблемы с производительностью

### Медленная загрузка страниц

#### Большой размер бандла
```bash
# Анализ бандла
bun run analyze

# Решения:
# 1. Lazy loading компонентов
const HeavyComponent = lazy(() => import('./HeavyComponent'))

# 2. Tree shaking для библиотек
import { debounce } from 'lodash/debounce' // вместо import _ from 'lodash'

# 3. Динамический импорт
const handleClick = async () => {
  const { heavyFunction } = await import('./heavyUtils')
  heavyFunction()
}
```

#### Медленные запросы к API
```typescript
// Решения:
// 1. Кеширование с React Query
const { data } = useQuery({
  queryKey: ['videos'],
  queryFn: getVideos,
  staleTime: 5 * 60 * 1000, // 5 минут кеша
})

// 2. Пагинация
const { data } = useInfiniteQuery({
  queryKey: ['videos'],
  queryFn: ({ pageParam = 0 }) => getVideos({ page: pageParam }),
  getNextPageParam: (lastPage, pages) => lastPage.nextPage,
})

// 3. Оптимистичные обновления
const mutation = useMutation({
  mutationFn: likeVideo,
  onMutate: async (videoId) => {
    await queryClient.cancelQueries(['video', videoId])
    const previousVideo = queryClient.getQueryData(['video', videoId])
    
    queryClient.setQueryData(['video', videoId], old => ({
      ...old,
      likeCount: old.likeCount + 1
    }))
    
    return { previousVideo }
  },
  onError: (err, videoId, context) => {
    queryClient.setQueryData(['video', videoId], context.previousVideo)
  }
})
```

### Memory leaks

#### Не очищенные эффекты
```typescript
// Проблема: подписки не отменяются

// Плохо
useEffect(() => {
  const interval = setInterval(() => {
    console.log('tick')
  }, 1000)
  
  // Забыли очистить!
}, [])

// Хорошо
useEffect(() => {
  const interval = setInterval(() => {
    console.log('tick')
  }, 1000)
  
  return () => clearInterval(interval)
}, [])

// Для EventListeners
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth)
  
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

## 🔧 Проблемы с development tools

### VS Code проблемы

#### TypeScript IntelliSense не работает
```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}

// Перезапуск TS сервера:
// Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### Prettier конфликтует с ESLint
```json
// .eslintrc.js
{
  "extends": [
    "next/core-web-vitals",
    "prettier" // Должен быть последним
  ],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

### Git проблемы

#### Большие файлы в коммитах
```bash
# Проблема: случайно добавили node_modules или .next

# Удаление из staging
git reset HEAD node_modules/
git reset HEAD .next/

# Обновление .gitignore
echo "node_modules/" >> .gitignore
echo ".next/" >> .gitignore
echo "dist/" >> .gitignore

# Удаление из истории (осторожно!)
git filter-branch --tree-filter 'rm -rf node_modules' HEAD
```

#### Конфликты в lock файлах
```bash
# Для bun.lockb
git checkout HEAD -- bun.lockb
bun install

# Для package-lock.json
git checkout HEAD -- package-lock.json
npm install
```

## 🐛 Отладка в production

### Error boundaries не ловят ошибки
```typescript
// Проблема: async ошибки не ловятся Error Boundary

// Решение: глобальный error handler
useEffect(() => {
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason)
    // Отправить в сервис мониторинга
    reportError(event.reason)
  }
  
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
  
  return () => {
    window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  }
}, [])
```

### Проблемы с SSR/Hydration
```typescript
// Проблема: различия между сервером и клиентом

// Решение: проверка на клиенте
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) {
  return null // или skeleton
}

// Альтернатива: suppressHydrationWarning
<div suppressHydrationWarning>
  {new Date().toISOString()}
</div>
```

## 📞 Когда обращаться за помощью

### Создание issue
При создании issue включите:
1. Версию Node.js и npm/bun
2. Операционную систему
3. Полный текст ошибки
4. Шаги для воспроизведения
5. Ожидаемое поведение

### Debug информация
```bash
# Полезные команды для диагностики
node --version
bun --version
npm ls # список зависимостей
bun pm ls

# Логи Next.js
DEBUG=* bun dev

# Логи сборки
bun run build --debug
```

### Полезные ресурсы
- [Next.js Документация](https://nextjs.org/docs)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TanStack Query DevTools](https://tanstack.com/query/v4/docs/devtools)
- [Tailwind CSS IntelliSense](https://tailwindcss.com/docs/editor-setup)

---

**Если проблема не решена:** создайте issue в репозитории с подробным описанием и всеми шагами для воспроизведения.
