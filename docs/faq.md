# ❓ FAQ - Часто задаваемые вопросы

Ответы на самые популярные вопросы о YouTube Clone проекте.

## 🚀 Общие вопросы

### Что такое YouTube Clone?
YouTube Clone - это современное веб-приложение, реализующее основные функции видеохостинга: просмотр, поиск, загрузка видео, система каналов, комментарии и плейлисты. Проект построен на Next.js 15, React 19, TypeScript и Tailwind CSS.

### Какие технологии используются?
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI**: Radix UI, shadcn/ui, Lucide Icons
- **State Management**: TanStack Query, React Context
- **Forms**: React Hook Form, Zod validation
- **Testing**: Jest, Testing Library
- **Styling**: Tailwind CSS, CSS Variables
- **Build Tools**: Bun, PostCSS

### Можно ли использовать этот проект в продакшене?
Да, проект готов для продакшена, но требует подключения к backend API и настройки окружения. Убедитесь, что у вас есть:
- Настроенный backend сервер
- Переменные окружения
- SSL сертификаты для HTTPS
- CDN для статических файлов

## 🛠️ Установка и настройка

### Какие системные требования?
- **Node.js**: версия 18.0 или выше
- **Package Manager**: Bun (рекомендуется), npm или yarn
- **Git**: для клонирования репозитория
- **Браузер**: Chrome, Firefox, Safari (последние версии)

### Почему рекомендуется Bun вместо npm?
Bun обеспечивает:
- Более быструю установку зависимостей
- Встроенный bundler и transpiler
- Лучшую производительность
- Совместимость с npm экосистемой

Однако npm и yarn также поддерживаются.

### Как настроить переменные окружения?
Создайте файл `.env.local` в корне проекта:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: для работы с изображениями
NEXT_PUBLIC_IMAGES_BASE_PATH=/path/to/images
```

### Можно ли запустить без backend?
Да, но с ограничениями. Многие компоненты будут показывать состояния загрузки или ошибки. Для полного функционала нужен backend API.

## 🏗️ Разработка

### Как добавить новую страницу?
1. Создайте папку в `src/app/` с названием маршрута
2. Добавьте `page.tsx`, `layout.tsx` (опционально)
3. Создайте компоненты в соответствующем модуле `src/modules/`
4. Добавьте необходимые хуки и API методы

Подробнее в [Добавление новых страниц](./adding-pages.md).

### Как создать новый компонент?
1. Определите тип компонента (UI, domain-specific, composite)
2. Создайте файл в соответствующей папке `src/components/`
3. Используйте TypeScript интерфейсы для пропсов
4. Добавьте тесты в `__tests__/` папку
5. Экспортируйте из `index.ts` файла

### Как добавить новый API endpoint?
1. Обновите `API_CONFIG` в `src/lib/api-config.ts`
2. Добавьте методы в `ApiClient` (`src/lib/api-client.ts`)
3. Создайте TypeScript типы в `src/types/`
4. Создайте хуки для использования в компонентах
5. Добавьте тесты

Подробнее в [API интеграция](./api-integration.md).

### Как работает аутентификация?
Проект использует OAuth2 flow с JWT токенами:
1. Пользователь вводит credentials
2. Получает access и refresh токены
3. Access токен используется для API запросов
4. Refresh токен для обновления access токена
5. Middleware защищает приватные маршруты

### Как добавить новую тему?
1. Обновите CSS переменные в `globals.css`
2. Добавьте новую тему в контекст `ThemeProvider`
3. Обновите `tailwind.config.ts` если нужны новые цвета
4. Добавьте переключатель темы в UI

## 🎨 Стилизация

### Почему Tailwind CSS?
- **Utility-first** подход для быстрой разработки
- **Consistency** в дизайне через design tokens
- **Performance** - только используемые стили в bundle
- **Developer Experience** - IntelliSense поддержка
- **Customization** - легко кастомизировать

### Как кастомизировать компоненты shadcn/ui?
1. Найдите компонент в `src/components/ui/`
2. Измените стили через Tailwind классы
3. Или обновите CSS переменные в `globals.css`
4. Используйте `cn()` utility для conditional styling

### Как добавить новые цвета в тему?
1. Добавьте CSS переменные в `:root` и `.dark`
2. Обновите `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      'custom-color': 'hsl(var(--custom-color))',
    }
  }
}
```

### Как сделать компонент responsive?
Используйте Tailwind breakpoints:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Item key={item.id} />)}
</div>
```

## 🧪 Тестирование

### Какие типы тестов используются?
- **Unit тесты** - отдельные компоненты и функции
- **Integration тесты** - взаимодействие компонентов
- **API тесты** - тестирование API клиента
- **E2E тесты** - полный user flow (планируется)

### Как запустить тесты?
```bash
# Все тесты
bun test

# С watch режимом
bun run test:watch

# С покрытием кода
bun run test:coverage

# Конкретный тест
bun test Button.test.tsx
```

### Как мокировать API в тестах?
Используйте Jest mocks или MSW (Mock Service Worker):

```typescript
// Jest mock
jest.mock('@/lib/api-client', () => ({
  api: {
    getVideos: jest.fn().mockResolvedValue([mockVideo]),
  },
}))

// MSW
import { rest } from 'msw'
const handlers = [
  rest.get('/api/videos', (req, res, ctx) => {
    return res(ctx.json([mockVideo]))
  }),
]
```

### Как тестировать компоненты с хуками?
Используйте wrapper с провайдерами:

```typescript
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </QueryClientProvider>
)

renderHook(() => useVideos(), { wrapper })
```

## 🚀 Деплой и продакшен

### Как собрать проект для продакшена?
```bash
# Сборка
bun run build

# Запуск продакшен версии
bun start

# Экспорт статического сайта
bun run export
```

### Какие платформы поддерживаются для деплоя?
- **Vercel** - рекомендуется (Zero-config деплой)
- **Netlify** - поддержка Next.js
- **Docker** - для любых платформ
- **AWS** - через Amplify или EC2
- **Railway, Render** - альтернативы

### Как настроить environment variables в продакшене?
В зависимости от платформы:

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_API_URL
```

**Netlify:**
```bash
netlify env:set NEXT_PUBLIC_API_URL https://api.example.com
```

**Docker:**
```dockerfile
ENV NEXT_PUBLIC_API_URL=https://api.example.com
```

### Как оптимизировать производительность?
1. **Code splitting** - используйте dynamic imports
2. **Image optimization** - Next.js Image компонент
3. **Caching** - настройте proper cache headers
4. **Bundle analysis** - `bun run analyze`
5. **Lazy loading** - для тяжелых компонентов

## 🔧 Кастомизация

### Как изменить цветовую схему?
1. Отредактируйте CSS переменные в `src/app/globals.css`
2. Обновите `tailwind.config.ts` для новых цветов
3. Перегенерируйте типы Tailwind

### Как добавить новые иконки?
1. **Lucide Icons** (рекомендуется):
```typescript
import { NewIcon } from 'lucide-react'
<NewIcon className="w-4 h-4" />
```

2. **Custom SVG**:
```typescript
// src/components/icons/CustomIcon.tsx
export const CustomIcon = ({ className }) => (
  <svg className={className}>
    {/* SVG content */}
  </svg>
)
```

### Как изменить шрифты?
Обновите `src/app/layout.tsx`:

```typescript
import { Inter, Roboto } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'] })
```

### Как добавить новые языки?
1. Установите i18n библиотеку (next-intl, react-i18next)
2. Создайте файлы переводов
3. Настройте провайдер локализации
4. Обновите компоненты для поддержки переводов

## 🐛 Отладка

### Как включить debug режим?
```bash
# Next.js debug
DEBUG=* bun dev

# React Query DevTools уже включен в development
```

### Как посмотреть bundle размер?
```bash
# Анализ bundle
bun run analyze

# Откроется интерактивная диаграмма bundle состава
```

### Почему компонент не обновляется?
Частые причины:
1. **Мутация state** вместо immutable обновления
2. **Неправильные dependencies** в useEffect
3. **Отсутствие key** в списках
4. **Stale closure** в event handlers

### Как отладить API запросы?
1. **Network tab** в DevTools
2. **React Query DevTools** для кеша
3. **Console logs** в api-client
4. **Proxy logs** в Next.js API routes

## 📱 Мобильная версия

### Полностью ли адаптивен проект?
Да, проект использует mobile-first подход с Tailwind CSS breakpoints и адаптивными компонентами.

### Как тестировать на мобильных устройствах?
1. **Chrome DevTools** - Device simulation
2. **Responsive Design Mode** в Firefox
3. **Real device testing** через ngrok или локальную сеть
4. **BrowserStack** для тестирования на разных устройствах

### Поддерживается ли PWA?
Базовая структура есть, но полноценная PWA поддержка требует дополнительной настройки:
- Service Worker
- Web App Manifest  
- Offline functionality
- Push notifications

## 🔐 Безопасность

### Какие меры безопасности реализованы?
- **HTTPS** в продакшене
- **JWT токены** для аутентификации
- **CORS** настройки
- **XSS защита** через React
- **CSRF** защита в формах
- **Валидация** с Zod

### Как защитить приватные страницы?
Используется middleware и AuthGuard компоненты:

```typescript
// middleware.ts защищает маршруты
// AuthGuard компонент проверяет аутентификацию
<AuthGuard requireAuth>
  <ProtectedContent />
</AuthGuard>
```

### Как обрабатываются пользовательские данные?
- **Валидация** на frontend и backend
- **Санитизация** пользовательского контента
- **Хеширование** паролей на backend
- **Secure storage** токенов в httpOnly cookies (рекомендуется)

## 📞 Поддержка

### Где получить помощь?
1. **Документация** - все руководства в папке `docs/`
2. **GitHub Issues** - для багов и feature requests
3. **Discussions** - для вопросов сообщества
4. **Stack Overflow** - с тегом [youtube-clone]

### Как сообщить о баге?
1. Проверьте [Troubleshooting](./troubleshooting.md)
2. Поищите существующие issues
3. Создайте новый issue с:
   - Описанием проблемы
   - Шагами воспроизведения
   - Ожидаемым поведением
   - Версиями ПО

### Как предложить новую функцию?
1. Создайте **Feature Request** issue
2. Опишите use case и преимущества
3. Приложите mockups если возможно
4. Участвуйте в обсуждении

---

**Не нашли ответ на свой вопрос?** Создайте issue или обратитесь к разделу [Troubleshooting](./troubleshooting.md).
