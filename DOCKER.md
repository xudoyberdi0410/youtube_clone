# Docker Setup for YouTube Clone

## Команды для работы с Docker

### Локальная разработка
```bash
# Сборка и запуск в development режиме
docker-compose up dev

# Доступ к приложению: http://localhost:3000
```

### Тестирование production сборки локально
```bash
# Сборка проекта
docker-compose run --rm build

# Запуск production версии с nginx
docker-compose up prod

# Доступ к приложению: http://localhost:8080
```

### Ручная сборка Docker образа
```bash
# Сборка образа для разработки
docker build --target base -t youtube-clone:dev .

# Сборка образа с готовой сборкой
docker build --target prerelease -t youtube-clone:build .

# Сборка production образа с nginx
docker build --target nginx -t youtube-clone:prod .
```

### Запуск отдельных контейнеров
```bash
# Development
docker run -p 3000:3000 -v $(pwd):/usr/src/app youtube-clone:dev bun run dev

# Production с nginx
docker run -p 8080:80 youtube-clone:prod
```

## Преимущества Docker подхода

1. **Изолированная среда** - одинаковое окружение локально и в CI/CD
2. **Консистентность** - устраняет проблемы "работает на моей машине"
3. **Кэширование** - Docker слои ускоряют повторные сборки
4. **Масштабируемость** - легко развертывать в любом Docker окружении

## Структура Dockerfile

- **base** - базовый образ с Bun
- **install** - установка зависимостей с кэшированием
- **prerelease** - сборка приложения
- **nginx** - production образ для статических файлов

## GitHub Actions

Workflow автоматически:
1. Собирает проект в Docker контейнере
2. Извлекает статические файлы
3. Деплоит на GitHub Pages

Это обеспечивает консистентность между CI/CD и локальной разработкой.
