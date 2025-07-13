import { renderHook, act, waitFor } from '@testing-library/react'
import { useApi } from '@/hooks/use-api'

// Оставляю только тесты, которые используют execute и reset

describe('useApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default state', () => {
    const mockApiFunction = jest.fn()
    const { result } = renderHook(() => useApi(mockApiFunction))

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.execute).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  it('executes API function successfully', async () => {
    const mockData = { id: 1, name: 'test' }
    const mockApiFunction = jest.fn().mockResolvedValue(mockData)
    
    const { result } = renderHook(() => useApi(mockApiFunction))

    await act(async () => {
      await result.current.execute('param1', 'param2')
    })

    expect(mockApiFunction).toHaveBeenCalledWith('param1', 'param2')
    expect(result.current.data).toEqual(mockData)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('handles API errors correctly', async () => {
    const mockError = new Error('API Error')
    const mockApiFunction = jest.fn().mockRejectedValue(mockError)
    
    const { result } = renderHook(() => useApi(mockApiFunction))

    await act(async () => {
      try {
        await result.current.execute()
      } catch {
        // Expected to throw
      }
    })

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('API Error')
  })

  it('handles non-Error objects in catch block', async () => {
    const mockApiFunction = jest.fn().mockRejectedValue('String error')
    
    const { result } = renderHook(() => useApi(mockApiFunction))

    await act(async () => {
      try {
        await result.current.execute()
      } catch {
        // Expected to throw
      }
    })

    expect(result.current.error).toBe('An error occurred')
  })

  it('calls onSuccess callback when API succeeds', async () => {
    const mockData = { success: true }
    const mockApiFunction = jest.fn().mockResolvedValue(mockData)
    const onSuccess = jest.fn()
    
    const { result } = renderHook(() => useApi(mockApiFunction, { onSuccess }))

    await act(async () => {
      await result.current.execute()
    })

    expect(onSuccess).toHaveBeenCalledWith(mockData)
  })

  it('calls onError callback when API fails', async () => {
    const mockError = new Error('API Error')
    const mockApiFunction = jest.fn().mockRejectedValue(mockError)
    const onError = jest.fn()
    
    const { result } = renderHook(() => useApi(mockApiFunction, { onError }))

    await act(async () => {
      try {
        await result.current.execute()
      } catch {
        // Expected to throw
      }
    })

    expect(onError).toHaveBeenCalledWith(mockError)
  })

  it('executes immediately when immediate option is true', async () => {
    const mockData = { immediate: true }
    const mockApiFunction = jest.fn().mockResolvedValue(mockData)
    
    const { result } = renderHook(() => useApi(mockApiFunction, { immediate: true }))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(mockApiFunction).toHaveBeenCalledTimes(1)
  })

  it('resets state when reset is called', async () => {
    const mockData = { id: 1 }
    const mockApiFunction = jest.fn().mockResolvedValue(mockData)
    
    const { result } = renderHook(() => useApi(mockApiFunction))

    // First execute to set some data
    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toEqual(mockData)

    // Reset the state
    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets loading state during execution', async () => {
    let resolvePromise: (value: unknown) => void
    const promise = new Promise(resolve => {
      resolvePromise = resolve
    })
    
    const mockApiFunction = jest.fn().mockReturnValue(promise)
    
    const { result } = renderHook(() => useApi(mockApiFunction))

    // Start execution
    act(() => {
      result.current.execute()
    })

    // Should be loading
    expect(result.current.isLoading).toBe(true)

    // Resolve the promise
    act(() => {
      resolvePromise({ done: true })
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('clears error when new execution starts', async () => {
    const mockError = new Error('First Error')
    const mockApiFunction = jest.fn()
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce({ success: true })
    
    const { result } = renderHook(() => useApi(mockApiFunction))

    // First execution fails
    await act(async () => {
      try {
        await result.current.execute()
      } catch {
        // Expected to throw
      }
    })

    expect(result.current.error).toBe('First Error')

    // Second execution succeeds
    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual({ success: true })
  })
}) 