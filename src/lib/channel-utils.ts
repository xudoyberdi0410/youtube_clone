/**
 * Утилиты для работы с каналами
 */

/**
 * Генерирует URL для канала
 * @param channelName - Имя канала (с сохранением регистра)
 * @returns URL для канала
 */
export function getChannelUrl(channelName: string): string {
  return `/channel?name=${encodeURIComponent(channelName)}`
}

/**
 * Генерирует красивый URL для канала с символом @
 * @param channelName - Имя канала
 * @returns URL вида /@channelname
 */
export function getChannelPrettyUrl(channelName: string): string {
  return `/@${channelName}`
}

/**
 * Извлекает имя канала из URL
 * @param url - URL канала
 * @returns Имя канала или null
 */
export function getChannelNameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    if (urlObj.pathname === '/channel') {
      return urlObj.searchParams.get('name')
    }
    if (urlObj.pathname.startsWith('/@')) {
      return urlObj.pathname.slice(2)
    }
    return null
  } catch {
    return null
  }
}
