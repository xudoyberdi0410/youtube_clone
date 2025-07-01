# 🛠️ Технологический стек

Обзор всех технологий, библиотек и инструментов, используемых в YouTube Clone проекте.

## ⚡ Основной стек

### Frontend Framework
- **[Next.js 15.1.6](https://nextjs.org/)** - React фреймворк с App Router
  - Server-side рендеринг (SSR)
  - Static site generation (SSG) 
  - API routes
  - Автоматическая оптимизация
  - Image optimization

### UI Framework
- **[React 19.0.0](https://reactjs.org/)** - Библиотека для построения UI
  - Functional компоненты
  - Hooks
  - Context API
  - Concurrent features

### Язык программирования
- **[TypeScript 5.x](https://www.typescriptlang.org/)** - Статическая типизация
  - Строгая типизация
  - IntelliSense поддержка
  - Refactoring tools
  - Compile-time проверки

## 🎨 Стилизация и UI

### CSS Framework
- **[Tailwind CSS 3.4.1](https://tailwindcss.com/)** - Utility-first CSS
  - Responsive design
  - Dark mode поддержка
  - Custom design system
  - Purging неиспользуемых стилей

### UI Components Library
- **[Radix UI](https://www.radix-ui.com/)** - Примитивы для компонентов
  - Доступность (a11y)
  - Keyboard navigation
  - Focus management
  - ARIA attributes

### Icons
- **[Lucide React](https://lucide.dev/)** - Современные SVG иконки
  - Tree-shakeable
  - TypeScript поддержка
  - Кастомизируемые

### Дополнительные UI утилиты
- **[shadcn/ui](https://ui.shadcn.com/)** - Компоненты на базе Radix UI
- **[class-variance-authority](https://cva.style/)** - Условные CSS классы
- **[clsx](https://github.com/lukeed/clsx)** - Утилита для объединения классов
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind классов

## 📊 Управление состоянием

### Data Fetching
- **[TanStack Query 5.80.7](https://tanstack.com/query/)** - Управление server state
  - Кеширование запросов
  - Background updates
  - Optimistic updates
  - Error handling
  - Pagination

### Forms
- **[React Hook Form 7.57.0](https://react-hook-form.com/)** - Управление формами
  - Минимальные re-renders
  - Built-in validation
  - TypeScript поддержка
  - Easy integration

### Validation
- **[Zod 3.25.64](https://zod.dev/)** - Schema validation
  - TypeScript-first
  - Runtime validation
  - Parse don't validate
  - Integration с React Hook Form

## 🧪 Тестирование

### Testing Framework
- **[Jest 29.7.0](https://jestjs.io/)** - JavaScript тестирование
  - Unit tests
  - Snapshot testing
  - Code coverage
  - Mocking

### React Testing
- **[Testing Library](https://testing-library.com/)** - Testing utilities
  - **@testing-library/react** - React компонент тестирование
  - **@testing-library/jest-dom** - Jest DOM assertions
  - **@testing-library/user-event** - User interaction simulation

### Test Environment
- **jest-environment-jsdom** - DOM simulation для тестов

## 📦 Package Manager и Build Tools

### Package Manager
- **[Bun](https://bun.sh/)** - Быстрый JavaScript runtime и package manager
  - Faster installation
  - Native bundler
  - TypeScript поддержка
  - Node.js совместимость

### Code Quality

#### Linting
- **[ESLint 9.x](https://eslint.org/)** - Статический анализ кода
  - Next.js правила
  - TypeScript интеграция
  - Автоматические исправления

#### Code Formatting
- **[Prettier](https://prettier.io/)** - Code formatter
  - Consistent formatting
  - IDE интеграция
  - Pre-commit hooks

## 🔧 Дополнительные библиотеки

### UI Enhancements
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme switching
- **[tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)** - CSS анимации
- **[sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[vaul](https://vaul.emilkowal.ski/)** - Drawer компонент

### Layout & Interaction
- **[react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)** - Изменяемые панели
- **[embla-carousel-react](https://www.embla-carousel.com/)** - Карусель компонент

### Date & Time
- **[date-fns](https://date-fns.org/)** - Date utility библиотека
- **[react-day-picker](https://react-day-picker.js.org/)** - Date picker компонент

### Charts & Visualization
- **[Recharts](https://recharts.org/)** - React charts библиотека

### Development Tools
- **[cmdk](https://cmdk.paco.me/)** - Command palette
- **[input-otp](https://input-otp.rodz.dev/)** - OTP input компонент

## 🗂️ Конфигурация файлов

### TypeScript
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Tailwind CSS
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    // Кастомная тема
  },
  plugins: [require("tailwindcss-animate")]
}
```

### Next.js
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Конфигурация Next.js
}
```

## 🏗️ Архитектурные решения

### 1. **App Router (Next.js 13+)**
- Новая система маршрутизации
- Server Components по умолчанию
- Nested layouts
- Loading и error boundaries

### 2. **Radix UI + Tailwind CSS**
- Доступные компоненты из коробки
- Кастомизация через Tailwind
- Consistent design system

### 3. **TanStack Query**
- Декларативная работа с API
- Автоматическое кеширование
- Background refetching

### 4. **TypeScript-first**
- Все компоненты типизированы
- API типизация
- Compile-time проверки

## 📈 Производительность

### Оптимизации Next.js
- **Image Optimization** - автоматическая оптимизация изображений
- **Bundle Splitting** - автоматическое разделение кода
- **Tree Shaking** - удаление неиспользуемого кода
- **Compression** - gzip/brotli сжатие

### React оптимизации
- **Lazy Loading** - ленивая загрузка компонентов
- **Memoization** - React.memo и useMemo
- **Virtual Scrolling** - для больших списков

## 🔮 Планы развития

### Ближайшие обновления
- Переход на React 19 стабильный
- Внедрение Server Actions
- Оптимизация bundle size

### Будущие технологии
- **PWA** поддержка
- **WebRTC** для live streaming
- **WebAssembly** для тяжелых вычислений

---

**Следующий раздел:** [Конфигурация проекта](./configuration.md)
