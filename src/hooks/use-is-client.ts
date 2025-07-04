// src/hooks/use-is-client.ts

import { useEffect, useState } from 'react'

/**
 * Хук для определения, выполняется ли код на клиенте
 * Помогает избежать hydration mismatch ошибок
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
