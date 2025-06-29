# 🚀 Быстрый старт с проксированием

## ✅ Проксирование настроено и работает!

Система временного проксирования успешно настроена для избежания CORS ошибок.

## Включить проксирование (избежать CORS)

1. В файле `.env.local` установите:
   ```bash
   NEXT_PUBLIC_USE_PROXY=true
   ```

2. Перезапустите сервер:
   ```bash
   bun dev
   ```

3. Готово! Все API запросы теперь идут через Next.js proxy

## Тестирование

### Автоматическое тестирование
Откройте http://localhost:3000/test и используйте кнопки для тестирования:
- **Test Direct API** - проверка прямого соединения с API
- **Test Proxy** - проверка работы проксирования
- **Test Login** - полный тест логина и получения данных пользователя

### Ручное тестирование
Откройте http://localhost:3000 и в консоли браузера выполните:

```javascript
// Тест проксирования
testProxy()

// Проверка статуса
console.log('Proxy enabled:', process.env.NEXT_PUBLIC_USE_PROXY)
```

## Выключить проксирование

1. В файле `.env.local` установите:
   ```bash
   NEXT_PUBLIC_USE_PROXY=false
   ```

2. Перезапустите сервер:
   ```bash
   bun dev
   ```

## Реальные endpoints

Подтверждено работающие endpoints из backend:
- ✅ `POST /login/token` - логин (требует `application/x-www-form-urlencoded`)
- ✅ `GET /user/get_user` - получение пользователя (требует авторизации)
- ✅ `PUT /user/put_user` - обновление пользователя
- ✅ `POST /user/post_image` - загрузка изображения
- ✅ `POST /post_user` - регистрация пользователя

## Документация

- 📖 [Полная документация](./PROXY-GUIDE.md)
- 📚 [API Client Guide](./API-CLIENT-GUIDE.md)
