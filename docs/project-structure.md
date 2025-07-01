# 🏗️ Структура проекта

Этот документ описывает архитектуру и организацию файлов в YouTube Clone проекте.

## 📁 Обзор корневой структуры

```
youtube_clone/
├── docs/                   # Документация проекта
├── public/                 # Статические файлы (изображения, иконки, SVG)
├── src/                    # Исходный код приложения
├── .env.local             # Переменные окружения (локальные)
├── .gitignore             # Игнорируемые Git файлы
├── bun.lock               # Файл блокировки зависимостей Bun
├── components.json        # Конфигурация shadcn/ui компонентов
├── eslint.config.mjs      # Конфигурация ESLint
├── jest.config.js         # Конфигурация Jest тестов
├── jest.setup.js          # Настройка тестового окружения
├── middleware.ts          # Next.js middleware
├── next.config.ts         # Конфигурация Next.js
├── package.json           # Зависимости и скрипты проекта
├── postcss.config.mjs     # Конфигурация PostCSS
├── README.md              # Основная документация
├── tailwind.config.ts     # Конфигурация Tailwind CSS
└── tsconfig.json          # Конфигурация TypeScript
```

## 📂 Детальная структура `/src`

### 🗂️ `/src/app` - App Router Next.js

```
src/app/
├── globals.css            # Глобальные стили
├── layout.tsx             # Корневой layout приложения
├── error.tsx              # Глобальная страница ошибок
├── not-found.tsx          # Страница 404
├── favicon.ico            # Иконка сайта
│
├── (home)/                # Группа маршрутов для главной страницы
│   ├── layout.tsx         # Layout для главной
│   └── page.tsx           # Главная страница
│
├── auth/                  # Маршруты авторизации
│   └── [mode]/            # Динамический маршрут (login/register)
│       ├── layout.tsx
│       └── page.tsx
│
├── channel/               # Страницы каналов
│   ├── layout.tsx
│   └── page.tsx
│
├── feed/                  # Персональные ленты пользователя
│   ├── layout.tsx
│   ├── history/           # История просмотров
│   ├── liked-videos/      # Понравившиеся видео
│   ├── playlists/         # Плейлисты пользователя
│   ├── subscriptions/     # Подписки
│   ├── watch-later/       # Смотреть позже
│   └── your-videos/       # Видео пользователя
│
├── playlist/              # Страницы плейлистов
│   ├── layout.tsx
│   └── [id]/              # Конкретный плейлист
│       └── page.tsx
│
├── watch/                 # Страница просмотра видео
│   ├── layout.tsx
│   └── page.tsx
│
├── settings/              # Настройки пользователя
│   ├── layout.tsx
│   └── page.tsx
│
├── api/                   # API маршруты Next.js
│   └── proxy/             # Прокси для внешних API
│
└── test/                  # Тестовые страницы
    └── page.tsx
```

### 🧩 `/src/components` - UI Компоненты

```
src/components/
├── ui/                    # Базовые UI компоненты (shadcn/ui)
│   ├── button.tsx         # Кнопки
│   ├── input.tsx          # Поля ввода
│   ├── dialog.tsx         # Модальные окна
│   ├── card.tsx           # Карточки
│   ├── form.tsx           # Формы
│   ├── avatar.tsx         # Аватары
│   ├── badge.tsx          # Бейджи
│   ├── alert.tsx          # Уведомления
│   └── ...                # Другие базовые компоненты
│
├── layouts/               # Layout компоненты
│   └── BaseLayout.tsx     # Основной layout с навигацией
│
├── auth/                  # Компоненты авторизации
│   └── AuthRequiredDialog.tsx
│
├── video/                 # Компоненты для работы с видео
│   ├── VideoPlayer.tsx    # Видеоплеер
│   ├── VideoCard.tsx      # Карточка видео
│   ├── VideoList.tsx      # Список видео
│   └── ...
│
├── playlist/              # Компоненты плейлистов
│   ├── PlaylistCard.tsx   # Карточка плейлиста
│   ├── CreatePlaylistDialog.tsx
│   ├── EditPlaylistDialog.tsx
│   └── index.ts           # Экспорты компонентов
│
└── youtube-icons/         # Иконки YouTube
    └── ...
```

### 🎣 `/src/hooks` - Кастомные хуки

```
src/hooks/
├── index.ts               # Общие экспорты хуков
├── use-api.ts             # Хук для API запросов
├── use-auth.ts            # Хук для авторизации
├── use-comments.ts        # Хук для комментариев
├── use-likes.ts           # Хук для лайков
├── use-local-storage.ts   # Хук для localStorage
├── use-mobile.tsx         # Хук для определения мобильных устройств
├── use-playlist.ts        # Хук для работы с плейлистами
├── use-playlists.ts       # Хук для списка плейлистов
├── use-subscriptions.ts   # Хук для подписок
├── use-toast.ts           # Хук для уведомлений
├── use-video-stats.ts     # Хук для статистики видео
├── use-video.ts           # Хук для работы с видео
└── use-videos.ts          # Хук для списка видео
```

### 📚 `/src/lib` - Библиотеки и утилиты

```
src/lib/
├── api-client.ts          # Основной API клиент
├── api-config.ts          # Конфигурация API
├── auth-utils.ts          # Утилиты для авторизации
├── channel-utils.ts       # Утилиты для каналов
├── constants.ts           # Глобальные константы
├── proxy-config.ts        # Конфигурация прокси
├── test-proxy.ts          # Тестовый прокси
├── utils.ts               # Общие утилиты
└── utils/                 # Дополнительные утилиты
    └── ...
```

### 🏗️ `/src/modules` - Бизнес-логика по доменам

```
src/modules/
├── auth/                  # Модуль авторизации
│   ├── components/        # Компоненты авторизации
│   ├── context/           # React контекст для auth
│   ├── hooks/             # Хуки для авторизации
│   └── utils/             # Утилиты авторизации
│
├── channel/               # Модуль каналов
├── error/                 # Модуль обработки ошибок
├── history/               # Модуль истории
├── home/                  # Модуль главной страницы
├── not-found/             # Модуль 404 страницы
└── settings/              # Модуль настроек
```

### 📝 `/src/types` - TypeScript типы

```
src/types/
├── api.ts                 # Типы для API ответов
├── auth.ts                # Типы для авторизации
├── common.ts              # Общие типы
├── svg.d.ts               # Типы для SVG файлов
└── video.ts               # Типы для видео
```

### 🧪 `/src/__tests__` - Тесты

```
src/__tests__/
├── api-client.test.ts     # Тесты API клиента
└── utils/                 # Тесты утилит
    ├── format.test.ts     # Тесты форматирования
    └── test-utils.tsx     # Утилиты для тестирования
```

## 📁 `/public` - Статические файлы

```
public/
├── favicon.ico            # Основная иконка сайта
├── youtube.svg            # Логотип YouTube
├── yt_icon_rgb.svg       # Цветная иконка YouTube
├── placeholder-playlist.svg # Плейсхолдер для плейлистов
├── file.svg               # Иконка файла
├── globe.svg              # Иконка глобуса
├── next.svg               # Логотип Next.js
├── vercel.svg             # Логотип Vercel
└── window.svg             # Иконка окна
```

## 🎯 Принципы организации

### 1. **Модульная архитектура**
Каждый домен (auth, video, playlist) изолирован в отдельный модуль со своими компонентами, хуками и утилитами.

### 2. **Разделение ответственности**
- `/app` - маршрутизация и page-level компоненты
- `/components` - переиспользуемые UI компоненты
- `/hooks` - логика состояния и side-effects
- `/lib` - утилиты и API интеграция
- `/types` - типизация

### 3. **Колокация (Colocation)**
Связанные файлы размещаются рядом друг с другом.

### 4. **Префиксы и именование**
- Компоненты: `PascalCase`
- Хуки: `use-kebab-case`
- Утилиты: `kebab-case`
- Константы: `UPPER_SNAKE_CASE`

## 🔗 Взаимосвязи модулей

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Pages    │───▶│ Components  │───▶│   Modules   │
│   (app/)    │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Hooks    │───▶│    Utils    │───▶│     API     │
│             │    │   (lib/)    │    │  (lib/)     │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 📖 Следующие разделы

- [Технологический стек](./tech-stack.md) - Подробно о используемых технологиях
- [Руководство по разработке](./development-guide.md) - Принципы разработки
- [API интеграция](./api-integration.md) - Работа с backend API
