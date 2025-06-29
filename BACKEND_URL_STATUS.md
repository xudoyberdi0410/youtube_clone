# Статус централизации URL бэкенда

## ✅ URL бэкенда НЕ захардкожен!

### 🎯 Текущее состояние

**Все правильно настроено:**

1. **Основная конфигурация использует переменную окружения:**
   ```typescript
   // src/lib/api-config.ts
   BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
   ```

2. **Переменная задана в .env.local:**
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Все API вызовы используют централизованную конфигурацию**

### 📊 Проверка кода

- ✅ **0 хардкодных URL** в TypeScript файлах (кроме fallback значения)
- ✅ **0 прямых fetch** с localhost
- ✅ **Все API вызовы** проходят через `apiClient` и `API_CONFIG`

### 🔧 Как изменить URL бэкенда

**Вариант 1: Через .env.local (рекомендуется)**
```bash
# Изменить в .env.local
NEXT_PUBLIC_API_URL=http://api.example.com
```

**Вариант 2: Через переменные окружения**
```bash
export NEXT_PUBLIC_API_URL=http://production-api.com
```

**Вариант 3: Через api-config.ts (только fallback)**
```typescript
BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://новый-url.com'
```

### 🌍 Для разных окружений

**Development (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Production (.env.production):**
```bash
NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

**Staging (.env.staging):**
```bash
NEXT_PUBLIC_API_URL=https://staging-api.yourapp.com
```

### ✨ Преимущества текущей настройки

1. **Гибкость** - можно менять URL через переменные окружения
2. **Безопасность** - нет хардкода в коде
3. **Разные окружения** - легко настроить dev/staging/production
4. **Единое место** - все проходит через API_CONFIG

## 🎉 Вывод

**URL бэкенда полностью централизован и настраивается через переменные окружения!**

Никаких хардкодных URL в коде нет, все работает правильно.
