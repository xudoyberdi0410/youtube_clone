import { useRef, useCallback, useEffect } from 'react'

/**
 * Хук для безопасной работы с таймерами и интервалами
 * Автоматически очищает таймеры при размонтировании компонента
 * 
 * @returns {Object} Объект с методами для работы с таймерами
 * 
 * @example
 * ```tsx
 * const { setTimeout, setInterval, clearAll } = useSafeTimeout()
 * 
 * useEffect(() => {
 *   const timeoutId = setTimeout(() => {
 *     console.log('Delayed action')
 *   }, 1000)
 * 
 *   const intervalId = setInterval(() => {
 *     console.log('Periodic action')
 *   }, 5000)
 * 
 *   return () => {
 *     clearAll() // Очищаем все таймеры
 *   }
 * }, [])
 * ```
 */
export function useSafeTimeout() {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set())
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set())
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      // Очищаем все таймеры при размонтировании
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout))
      intervalsRef.current.forEach(interval => clearInterval(interval))
      timeoutsRef.current.clear()
      intervalsRef.current.clear()
    }
  }, [])

  const setTimeout = useCallback((callback: () => void, delay: number) => {
    if (!isMountedRef.current) return null

    const timeoutId = global.setTimeout(() => {
      if (isMountedRef.current) {
        callback()
      }
      timeoutsRef.current.delete(timeoutId)
    }, delay)

    timeoutsRef.current.add(timeoutId)
    return timeoutId
  }, [])

  const setInterval = useCallback((callback: () => void, delay: number) => {
    if (!isMountedRef.current) return null

    const intervalId = global.setInterval(() => {
      if (isMountedRef.current) {
        callback()
      } else {
        clearInterval(intervalId)
        intervalsRef.current.delete(intervalId)
      }
    }, delay)

    intervalsRef.current.add(intervalId)
    return intervalId
  }, [])

  const clearTimeout = useCallback((timeoutId: NodeJS.Timeout) => {
    global.clearTimeout(timeoutId)
    timeoutsRef.current.delete(timeoutId)
  }, [])

  const clearInterval = useCallback((intervalId: NodeJS.Timeout) => {
    global.clearInterval(intervalId)
    intervalsRef.current.delete(intervalId)
  }, [])

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(timeout => global.clearTimeout(timeout))
    intervalsRef.current.forEach(interval => global.clearInterval(interval))
    timeoutsRef.current.clear()
    intervalsRef.current.clear()
  }, [])

  return {
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    clearAll,
    isMounted: isMountedRef.current
  }
} 