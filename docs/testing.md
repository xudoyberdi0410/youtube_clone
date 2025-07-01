# 🧪 Тестирование

Полное руководство по тестированию в YouTube Clone проекте.

## 📋 Обзор тестовой экосистемы

### Используемые инструменты
- **Jest** - Основной фреймворк для тестирования
- **Testing Library** - Utilities для тестирования React компонентов
- **jsdom** - DOM симуляция для браузерного окружения
- **MSW** (Mock Service Worker) - Мокирование API запросов

### Типы тестов
1. **Unit тесты** - Тестирование отдельных функций и компонентов
2. **Integration тесты** - Тестирование взаимодействия компонентов
3. **API тесты** - Тестирование API клиента
4. **E2E тесты** - End-to-end тестирование (планируется)

## ⚙️ Конфигурация тестирования

### Jest конфигурация (`jest.config.js`)

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**/*.tsx', // Исключаем page компоненты
    '!src/lib/constants.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Jest Setup (`jest.setup.js`)

```javascript
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Полифиллы для Node.js окружения
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Мокирование Next.js модулей
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Мокирование window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Мокирование localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

global.localStorage = localStorageMock
```

## 🧩 Тестирование компонентов

### Базовый тест компонента

```typescript
// src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Danger</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('renders as different element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/test')
  })
})
```

### Тестирование компонентов с контекстом

```typescript
// src/components/auth/__tests__/AuthRequiredDialog.test.tsx
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/modules/auth/context/auth-context'
import { AuthRequiredDialog } from '../AuthRequiredDialog'

// Вспомогательная функция для рендеринга с провайдерами
const renderWithAuth = (ui: React.ReactElement, { user = null } = {}) => {
  const mockAuthValue = {
    user,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    isLoading: false,
    error: null,
  }

  return render(
    <AuthProvider value={mockAuthValue}>
      {ui}
    </AuthProvider>
  )
}

describe('AuthRequiredDialog', () => {
  it('shows dialog when user is not authenticated', () => {
    renderWithAuth(
      <AuthRequiredDialog isOpen={true} onClose={jest.fn()}>
        <button>Protected Action</button>
      </AuthRequiredDialog>
    )

    expect(screen.getByText('Требуется авторизация')).toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' }
    
    renderWithAuth(
      <AuthRequiredDialog isOpen={false} onClose={jest.fn()}>
        <button>Protected Action</button>
      </AuthRequiredDialog>,
      { user: mockUser }
    )

    expect(screen.getByRole('button', { name: 'Protected Action' })).toBeInTheDocument()
  })
})
```

### Тестирование компонентов с формами

```typescript
// src/components/forms/__tests__/VideoUploadForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VideoUploadForm } from '../VideoUploadForm'

describe('VideoUploadForm', () => {
  const mockOnSubmit = jest.fn()
  
  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders all form fields', () => {
    render(<VideoUploadForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByLabelText(/название видео/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/описание/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/видео файл/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /загрузить видео/i })).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup()
    render(<VideoUploadForm onSubmit={mockOnSubmit} />)
    
    const submitButton = screen.getByRole('button', { name: /загрузить видео/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Название обязательно')).toBeInTheDocument()
      expect(screen.getByText('Выберите видео файл')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
    
    render(<VideoUploadForm onSubmit={mockOnSubmit} />)
    
    await user.type(screen.getByLabelText(/название видео/i), 'Test Video')
    await user.type(screen.getByLabelText(/описание/i), 'Test description')
    await user.upload(screen.getByLabelText(/видео файл/i), file)
    
    await user.click(screen.getByRole('button', { name: /загрузить видео/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Video',
        description: 'Test description',
        videoFile: file,
      })
    })
  })
})
```

## 🎣 Тестирование хуков

### Простой хук

```typescript
// src/hooks/__tests__/use-local-storage.test.ts
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../use-local-storage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('returns stored value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('stored-value')
  })

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(localStorage.getItem('test-key')).toBe('"new-value"')
  })

  it('removes item from localStorage when value is null', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1](null)
    })

    expect(localStorage.getItem('test-key')).toBeNull()
  })
})
```

### Хук с API запросами

```typescript
// src/hooks/__tests__/use-videos.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useVideos } from '../use-videos'
import { api } from '@/lib/api-client'

// Мокируем API клиент
jest.mock('@/lib/api-client')
const mockApi = api as jest.Mocked<typeof api>

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useVideos', () => {
  it('fetches videos successfully', async () => {
    const mockVideos = [
      { id: 1, title: 'Video 1', viewCount: 100 },
      { id: 2, title: 'Video 2', viewCount: 200 },
    ]
    
    mockApi.getAllVideos.mockResolvedValue(mockVideos)
    
    const { result } = renderHook(() => useVideos(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockVideos)
    expect(mockApi.getAllVideos).toHaveBeenCalledTimes(1)
  })

  it('handles API errors', async () => {
    const errorMessage = 'Failed to fetch videos'
    mockApi.getAllVideos.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useVideos(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toBe(errorMessage)
  })
})
```

## 🌐 Тестирование API клиента

### Мокирование fetch запросов

```typescript
// src/lib/__tests__/api-client.test.ts
import { ApiClient } from '../api-client'

// Мокируем fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('ApiClient', () => {
  let apiClient: ApiClient
  
  beforeEach(() => {
    apiClient = new ApiClient()
    mockFetch.mockClear()
  })

  describe('getAllVideos', () => {
    it('fetches videos successfully', async () => {
      const mockVideos = [
        { id: 1, title: 'Video 1' },
        { id: 2, title: 'Video 2' },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockVideos,
      } as Response)

      const result = await apiClient.getAllVideos()

      expect(result).toEqual(mockVideos)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/video/get_all_videos'),
        expect.objectContaining({
          method: 'GET',
        })
      )
    })

    it('handles API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response)

      await expect(apiClient.getAllVideos()).rejects.toThrow('API Error: 500 Internal Server Error')
    })
  })

  describe('createUser', () => {
    it('creates user with correct data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }

      const mockUser = { id: 1, ...userData }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response)

      const result = await apiClient.createUser(userData)

      expect(result).toEqual(mockUser)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/user/post_user'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        })
      )
    })
  })
})
```

### Тестирование с MSW (Mock Service Worker)

```typescript
// src/lib/__tests__/api-client.msw.test.ts
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { ApiClient } from '../api-client'
import { API_CONFIG } from '../api-config'

// Настройка MSW сервера
const server = setupServer(
  rest.get(`${API_CONFIG.BASE_URL}/video/get_all_videos`, (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, title: 'Video 1' },
        { id: 2, title: 'Video 2' },
      ])
    )
  }),
  
  rest.post(`${API_CONFIG.BASE_URL}/user/post_user`, (req, res, ctx) => {
    return res(
      ctx.json({ id: 1, username: 'testuser' })
    )
  }),
  
  rest.get(`${API_CONFIG.BASE_URL}/video/get_video_by_id/:id`, (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.json({ id: Number(id), title: `Video ${id}` })
    )
  })
)

// Настройка сервера
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ApiClient with MSW', () => {
  let apiClient: ApiClient
  
  beforeEach(() => {
    apiClient = new ApiClient()
  })

  it('fetches videos from mocked API', async () => {
    const videos = await apiClient.getAllVideos()
    
    expect(videos).toHaveLength(2)
    expect(videos[0]).toMatchObject({ id: 1, title: 'Video 1' })
  })

  it('handles API errors gracefully', async () => {
    // Переопределяем handler для имитации ошибки
    server.use(
      rest.get(`${API_CONFIG.BASE_URL}/video/get_all_videos`, (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )

    await expect(apiClient.getAllVideos()).rejects.toThrow()
  })
})
```

## 🧪 Интеграционные тесты

### Тестирование полного flow

```typescript
// src/__tests__/video-upload-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { VideoUploadPage } from '@/modules/video/components/VideoUploadPage'
import { AuthProvider } from '@/modules/auth/context/auth-context'

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  }

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialUser={mockUser}>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('Video Upload Flow', () => {
  it('allows user to upload video successfully', async () => {
    const user = userEvent.setup()
    
    render(<VideoUploadPage />, { wrapper: createTestWrapper() })

    // Заполняем форму
    await user.type(screen.getByLabelText(/название/i), 'My Test Video')
    await user.type(screen.getByLabelText(/описание/i), 'Test description')
    
    const file = new File(['video'], 'test.mp4', { type: 'video/mp4' })
    await user.upload(screen.getByLabelText(/видео файл/i), file)

    // Отправляем форму
    await user.click(screen.getByRole('button', { name: /загрузить/i }))

    // Проверяем успешную загрузку
    await waitFor(() => {
      expect(screen.getByText(/успешно загружено/i)).toBeInTheDocument()
    })
  })
})
```

## 📊 Утилиты для тестирования

### Test utilities файл

```typescript
// src/lib/test-utils.tsx
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/modules/auth/context/auth-context'

// Создание тестового QueryClient
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
})

// Провайдеры для тестов
interface AllProvidersProps {
  children: React.ReactNode
  queryClient?: QueryClient
  user?: any
}

const AllProviders = ({ children, queryClient, user }: AllProvidersProps) => {
  const client = queryClient || createTestQueryClient()
  
  return (
    <QueryClientProvider client={client}>
      <AuthProvider initialUser={user}>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}

// Кастомная функция рендеринга
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    queryClient?: QueryClient
    user?: any
  }
) => {
  const { queryClient, user, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders queryClient={queryClient} user={user}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  })
}

// Mock данные
export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  displayName: 'Test User',
}

export const mockVideo = {
  id: 1,
  title: 'Test Video',
  description: 'Test description',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  videoUrl: 'https://example.com/video.mp4',
  duration: 120,
  viewCount: 1000,
  likeCount: 50,
  uploadedAt: '2023-01-01T00:00:00Z',
  channel: {
    id: 1,
    name: 'Test Channel',
    avatarUrl: 'https://example.com/avatar.jpg',
  },
}

export const mockChannel = {
  id: 1,
  name: 'Test Channel',
  description: 'Test channel description',
  subscriberCount: 1000,
  videoCount: 50,
}

// Экспорт всех testing-library функций
export * from '@testing-library/react'
export { customRender as render }
```

## 🚀 Запуск тестов

### Команды для запуска

```bash
# Запуск всех тестов
bun test

# Запуск тестов в watch режиме
bun run test:watch

# Запуск тестов с покрытием
bun run test:coverage

# Запуск конкретного теста
bun test Button.test.tsx

# Запуск тестов в конкретной папке
bun test src/components/ui/

# Запуск тестов с verbose выводом
bun test --verbose
```

### Настройка CI/CD

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Run tests
        run: bun test --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 📋 Best Practices

### 1. Именование тестов
```typescript
// Хорошо - описательные названия
describe('VideoCard component', () => {
  it('displays video title and channel name', () => {})
  it('navigates to video page when clicked', () => {})
  it('shows duration in correct format', () => {})
})

// Плохо - неясные названия
describe('VideoCard', () => {
  it('works', () => {})
  it('test 1', () => {})
})
```

### 2. Arrange-Act-Assert pattern
```typescript
it('submits form with valid data', async () => {
  // Arrange
  const mockOnSubmit = jest.fn()
  const user = userEvent.setup()
  render(<MyForm onSubmit={mockOnSubmit} />)
  
  // Act
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  // Assert
  expect(mockOnSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
})
```

### 3. Использование data-testid для сложных селекторов
```typescript
// В компоненте
<div data-testid="video-card">
  <h3>{video.title}</h3>
</div>

// В тесте
const videoCard = screen.getByTestId('video-card')
```

### 4. Мокирование внешних зависимостей
```typescript
// Мокирование на уровне модуля
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser' },
    isLoading: false,
  }),
}))
```

## 📖 Следующие разделы

- [Отладка](./debugging.md) - Инструменты для отладки
- [Руководство по разработке](./development-guide.md) - Общие принципы разработки
- [Деплой](./deployment.md) - Подготовка к продакшену
