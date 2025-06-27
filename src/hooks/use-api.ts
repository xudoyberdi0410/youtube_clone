// src/hooks/use-api.ts

import { useState, useEffect, useCallback } from 'react'
import type { LoadingState } from '@/types/common'

interface UseApiOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

/**
 * Custom hook for API calls with loading states
 * @param apiFunction - The API function to call
 * @param options - Configuration options
 * @returns API state and control functions
 */
export function useApi<T>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { immediate = false, onSuccess, onError } = options
  
  const [state, setState] = useState<LoadingState & { data: T | null }>({
    data: null,
    isLoading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      try {
        const data = await apiFunction(...args)
        setState({ data, isLoading: false, error: null })
        onSuccess?.(data)
        return data
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred'
        setState(prev => ({ ...prev, isLoading: false, error: errorMessage }))
        onError?.(error as Error)
        throw error
      }
    },
    [apiFunction, onSuccess, onError]
  )

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
