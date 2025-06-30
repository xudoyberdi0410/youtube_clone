import { PROXY_CONFIG, getApiUrl, getProxyHeaders } from '@/lib/proxy-config'

/**
 * Простой тест проксирования API
 * Можно запустить в браузере консоли для проверки
 */
export const testProxy = async () => {
  console.group('🧪 Proxy Test')
  
  try {
    // Проверяем конфигурацию
    console.log('📋 Proxy Configuration:')
    console.log('  Enabled:', PROXY_CONFIG.ENABLED)
    console.log('  Backend URL:', PROXY_CONFIG.BACKEND_URL)
    console.log('  Proxy Path:', PROXY_CONFIG.PROXY_PATH)
    
    // Тестируем URL построение
    console.log('\n🔗 URL Building:')
    const testEndpoint = '/get_all_users'
    const apiUrl = getApiUrl(testEndpoint)
    console.log('  Endpoint:', testEndpoint)
    console.log('  Final URL:', apiUrl)
    
    // Тестируем заголовки
    console.log('\n📤 Headers:')
    const headers = getProxyHeaders()
    console.log('  Proxy Headers:', headers)
    
    // Простой GET запрос для тестирования
    console.log('\n🚀 Testing GET request...')
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    })
    
    console.log('  Status:', response.status)
    console.log('  Status Text:', response.statusText)
    console.log('  Headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log('  Success! Response:', data)
    } else {
      const errorText = await response.text()
      console.log('  Error Response:', errorText)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
  
  console.groupEnd()
}

// Глобальная функция для удобного тестирования
if (typeof window !== 'undefined') {
  (window as { testProxy?: typeof testProxy }).testProxy = testProxy
}

// Функция для быстрого переключения проксирования
export const toggleProxyInConsole = () => {
  const currentValue = process.env.NEXT_PUBLIC_USE_PROXY
  const newValue = currentValue === 'true' ? 'false' : 'true'
  
  console.log(`🔄 To toggle proxy: change NEXT_PUBLIC_USE_PROXY from '${currentValue}' to '${newValue}' in .env.local and restart server`)
}
