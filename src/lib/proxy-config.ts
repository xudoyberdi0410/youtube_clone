// Конфигурация для временного проксирования API запросов
// Позволяет избежать CORS ошибок во время разработки

export const PROXY_CONFIG = {
  // Включить/выключить проксирование
  // true - все API запросы идут через Next.js proxy
  // false - прямые запросы к backend API
  ENABLED: process.env.NEXT_PUBLIC_USE_PROXY === 'true',
  
  // URL backend сервера (для проксирования)
  BACKEND_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Путь к proxy endpoint в Next.js
  PROXY_PATH: '/api/proxy',
  
  // Таймаут для proxy запросов (в миллисекундах)
  TIMEOUT: 30000,
}

/**
 * Получить URL для API запроса с учетом проксирования
 */
export function getApiUrl(endpoint: string): string {
  if (PROXY_CONFIG.ENABLED) {
    // Если проксирование включено, используем Next.js API route
    return `${PROXY_CONFIG.PROXY_PATH}?endpoint=${encodeURIComponent(endpoint)}`
  } else {
    // Прямой запрос к backend
    return `${PROXY_CONFIG.BACKEND_URL}${endpoint}`
  }
}

/**
 * Получить заголовки для API запроса с учетом проксирования
 */
export function getProxyHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  
  if (PROXY_CONFIG.ENABLED) {
    // При проксировании передаем backend URL в заголовке
    headers['X-Backend-URL'] = PROXY_CONFIG.BACKEND_URL
  }
  
  return headers
}
