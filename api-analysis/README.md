# API Analysis Reports

Эта папка содержит отчеты автоматического тестирования API.

## Файлы

- `api-test-report-*.md` - Подробные отчеты в формате Markdown с анализом всех endpoint'ов
- `simple-api-test-*.json` - JSON данные тестирования для программной обработки

## Запуск тестирования

```bash
npm run api:test
```

Эта команда:

1. Загружает OpenAPI спецификацию с сервера
2. Создает тестового пользователя и получает токен авторизации
3. Тестирует все endpoint'ы (GET, POST, PUT, DELETE)
4. Проверяет работу с файлами (изображения, видео)
5. Генерирует подробные отчеты с рекомендациями

## Структура отчета

### Markdown отчет включает:
- 📊 Общую статистику тестирования
- 🚨 Список проблемных endpoint'ов в начале
- 📋 Детальный анализ каждого endpoint'а:
  - Входные параметры
  - Требования к авторизации
  - Ответы с/без токена
  - Статусы и ошибки
- 🎯 Выводы и рекомендации по улучшению

### JSON отчет содержит:
- Структурированные данные всех тестов
- Метаданные (timestamp, baseUrl, authToken)
- Подробные результаты каждого запроса
- Статистику для программной обработки

## Примечания

- DELETE операции тестируются после всех остальных
- DELETE `/user/delete_user` выполняется в самом конце
- Файлы отчетов генерируются с timestamp'ом
- Старые отчеты нужно периодически очищать
