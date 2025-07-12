import { useRef, useEffect } from 'react'

/**
 * Хук для отслеживания состояния монтирования компонента
 * Помогает предотвратить утечки памяти при асинхронных операциях
 * 
 * @returns {boolean} isMounted - флаг, указывающий смонтирован ли компонент
 * @returns {() => boolean} checkMounted - функция для проверки состояния монтирования
 * 
 * @example
 * ```tsx
 * const { isMounted, checkMounted } = useIsMounted()
 * 
 * const loadData = async () => {
 *   const data = await api.getData()
 *   if (checkMounted()) {
 *     setData(data) // Безопасно обновляем состояние
 *   }
 * }
 * ```
 */
export function useIsMounted() {
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const checkMounted = () => isMountedRef.current

  return {
    isMounted: isMountedRef.current,
    checkMounted
  }
} 