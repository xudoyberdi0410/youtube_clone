import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Проверяем, если путь начинается с /@
  if (pathname.startsWith('/@')) {
    // Убираем @ и получаем имя канала
    const channelName = pathname.slice(2) // убираем /@
    
    // Проверяем, что это не системные пути
    if (channelName && !channelName.startsWith('api') && !channelName.startsWith('_next')) {
      // Перенаправляем на специальный роут для каналов с именем в параметрах
      const newUrl = new URL('/channel', request.url)
      
      // Добавляем имя канала как query параметр (сохраняет регистр)
      newUrl.searchParams.set('name', channelName)
      
      return NextResponse.rewrite(newUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
