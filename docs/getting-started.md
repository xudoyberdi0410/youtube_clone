# 🚀 Установка и запуск проекта

## Системные требования

Перед началом работы убедитесь, что у вас установлены:

- **Node.js** версии 18.0 или выше
- **Bun** (рекомендуется) или **npm/yarn**
- **Git** для клонирования репозитория
- **VS Code** (рекомендуется) с расширениями для TypeScript и React

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone [URL_РЕПОЗИТОРИЯ]
cd youtube_clone
```

### 2. Установка зависимостей

**С Bun (рекомендуется):**
```bash
bun install
```

**С npm:**
```bash
npm install
```

**С yarn:**
```bash
yarn install
```

### 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: для локальной разработки
NEXT_PUBLIC_IMAGES_BASE_PATH=C:\путь\к\изображениям\backend
```

### 4. Запуск проекта

**Режим разработки:**
```bash
bun dev
# или
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Доступные команды

### Основные команды разработки

```bash
# Запуск в режиме разработки
bun dev

# Сборка проекта для продакшена
bun run build

# Запуск продакшен версии
bun start

# Проверка типов TypeScript
bun run type-check
```

### Линтинг и форматирование

```bash
# Проверка кода линтером
bun run lint

# Исправление ошибок линтера
bun run lint:fix

# Форматирование кода
bun run format

# Проверка форматирования
bun run format:check
```

### Тестирование

```bash
# Запуск тестов
bun test

# Тесты в режиме наблюдения
bun run test:watch

# Тесты с покрытием кода
bun run test:coverage
```

### Дополнительные команды

```bash
# Очистка кэша и сборки
bun run clean

# Анализ размера бандла
bun run analyze

# Экспорт статического сайта
bun run export

# Деплой (если настроен)
bun run deploy
```

## Настройка IDE

### VS Code

Рекомендуемые расширения:
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

Создайте файл `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## Структура после установки

После успешной установки ваша структура проекта должна выглядеть так:

```
youtube_clone/
├── .env.local              # Переменные окружения (создать вручную)
├── .next/                  # Папка сборки Next.js (создается автоматически)
├── node_modules/           # Зависимости
├── public/                 # Статические файлы
├── src/                    # Исходный код
├── docs/                   # Документация
├── package.json            # Конфигурация проекта
├── tailwind.config.ts      # Конфигурация Tailwind CSS
├── tsconfig.json           # Конфигурация TypeScript
└── next.config.ts          # Конфигурация Next.js
```

## Проверка установки

Для проверки правильности установки:

1. **Запустите проект:** `bun dev`
2. **Откройте браузер:** http://localhost:3000
3. **Проверьте консоль:** не должно быть критических ошибок
4. **Запустите тесты:** `bun test`

## Частые проблемы

### Проблема с зависимостями

```bash
# Удалите node_modules и переустановите
rm -rf node_modules bun.lockb
bun install
```

### Проблемы с портом

Если порт 3000 занят, Next.js автоматически предложит другой порт, или укажите его явно:

```bash
bun dev -p 3001
```

### Проблемы с TypeScript

```bash
# Проверьте конфигурацию TypeScript
bun run type-check
```

## Следующие шаги

После успешной установки рекомендуется:

1. Ознакомиться со [структурой проекта](./project-structure.md)
2. Изучить [технологический стек](./tech-stack.md)
3. Прочитать [руководство по разработке](./development-guide.md)

---

Если у вас возникли проблемы с установкой, обратитесь к разделу [Troubleshooting](./troubleshooting.md).
