export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

// Timeout для fetch запросов
const FETCH_TIMEOUT = 30000

/**
 * Proxy endpoint для проксирования запросов к backend API
 * Это позволяет избежать CORS ошибок во время разработки
 */
export async function GET(request: NextRequest) {
  return handleProxyRequest(request)
}

export async function POST(request: NextRequest) {
  return handleProxyRequest(request)
}

export async function PUT(request: NextRequest) {
  return handleProxyRequest(request)
}

export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request)
}

export async function PATCH(request: NextRequest) {
  return handleProxyRequest(request)
}

async function handleProxyRequest(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint parameter is required' },
        { status: 400 }
      )
    }

    // Получаем backend URL из заголовков или переменной окружения
    const backendUrl = request.headers.get('X-Backend-URL') || 
                      process.env.NEXT_PUBLIC_API_URL || 
                      'http://localhost:8000'

    const targetUrl = `${backendUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`

    // Копируем заголовки из оригинального запроса
    const proxyHeaders = new Headers()
    
    // Копируем важные заголовки
    const headersToProxy = [
      'authorization',
      'content-type',
      'accept',
      'x-api-key',
      'x-user-id'
    ]

    headersToProxy.forEach(headerName => {
      const value = request.headers.get(headerName)
      if (value) {
        proxyHeaders.set(headerName, value)
      }
    })

    // Получаем тело запроса если есть
    let body: BodyInit | undefined
    const contentType = request.headers.get('content-type')
    
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      if (contentType?.includes('application/json')) {
        // JSON данные
        const jsonData = await request.json()
        body = JSON.stringify(jsonData)
        proxyHeaders.set('content-type', 'application/json')
      } else if (contentType?.includes('multipart/form-data')) {
        // FormData для загрузки файлов
        body = await request.formData()
        // Не устанавливаем content-type для FormData, браузер сделает это автоматически
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        // URL encoded данные
        body = await request.text()
        proxyHeaders.set('content-type', 'application/x-www-form-urlencoded')
      } else {
        // Остальные типы как есть
        body = await request.arrayBuffer()
      }
    }

    // Создаем контроллер для таймаута
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

    // Делаем запрос к backend
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: proxyHeaders,
      body,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Копируем заголовки ответа
    const responseHeaders = new Headers()
    
    // Копируем нужные заголовки ответа
    const responseHeadersToProxy = [
      'content-type',
      'cache-control',
      'etag',
      'last-modified'
    ]

    responseHeadersToProxy.forEach(headerName => {
      const value = response.headers.get(headerName)
      if (value) {
        responseHeaders.set(headerName, value)
      }
    })

    // Добавляем CORS заголовки
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, X-User-ID')

    // Просто проксируем ответ backend-а без обработки
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })

  } catch (error) {
    console.error('Proxy error:', error);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout' },
          { status: 408 }
        );
      }

      // Убедимся, что сообщение об ошибке корректно форматируется
      const safeMessage = JSON.stringify({ error: `Proxy error: ${error.message}` });
      return NextResponse.json(
        JSON.parse(safeMessage),
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown proxy error' },
      { status: 500 }
    )
  }
}

// Обработка OPTIONS запросов для CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, X-User-ID',
      'Access-Control-Max-Age': '86400',
    },
  })
}
