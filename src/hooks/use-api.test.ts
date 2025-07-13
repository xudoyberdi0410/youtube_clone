import { renderHook, act, waitFor } from '@testing-library/react'
import { useApi } from './use-api'

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

  it('should handle network errors', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'))
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test')
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.loading).toBe(false)
  })

  it('should handle HTTP errors', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: jest.fn().mockResolvedValue({ message: 'Server error' })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test')
    })

    expect(result.current.error).toBe('HTTP error! status: 500')
    expect(result.current.loading).toBe(false)
  })

  it('should handle JSON parsing errors', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test')
    })

    expect(result.current.error).toBe('Invalid JSON')
    expect(result.current.loading).toBe(false)
  })

  it('should handle unknown errors', async () => {
    const mockFetch = jest.fn().mockRejectedValue('Unknown error')
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test')
    })

    expect(result.current.error).toBe('Unknown error')
    expect(result.current.loading).toBe(false)
  })

  it('should handle request cancellation', async () => {
    const mockFetch = jest.fn().mockImplementation(() => {
      const controller = new AbortController()
      controller.abort()
      return Promise.reject(new Error('Request aborted'))
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test')
    })

    expect(result.current.error).toBe('Request aborted')
    expect(result.current.loading).toBe(false)
  })

  it('should handle timeout errors', async () => {
    const mockFetch = jest.fn().mockImplementation(() => {
      return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 100)
      })
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test')
    })

    expect(result.current.error).toBe('Request timeout')
    expect(result.current.loading).toBe(false)
  })

  it('should handle different response types', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: 'test' })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      const response = await result.current.get('/test')
      expect(response).toEqual({ data: 'test' })
    })

    expect(result.current.error).toBe(null)
    expect(result.current.loading).toBe(false)
  })

  it('should handle request with custom headers', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test', { headers: { 'Custom-Header': 'value' } })
    })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Custom-Header': 'value'
        })
      })
    )
  })

  it('should handle request with body data', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    const testData = { name: 'test', value: 123 }

    await act(async () => {
      await result.current.post('/test', testData)
    })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(testData)
      })
    )
  })

  it('should handle request with query parameters', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test', { params: { page: 1, limit: 10 } })
    })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('?page=1&limit=10'),
      expect.any(Object)
    )
  })

  it('should handle concurrent requests', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      const promises = [
        result.current.get('/test1'),
        result.current.get('/test2'),
        result.current.get('/test3')
      ]
      await Promise.all(promises)
    })

    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(result.current.loading).toBe(false)
  })

  it('should handle request with different HTTP methods', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.put('/test', { data: 'update' })
      await result.current.delete('/test')
      await result.current.patch('/test', { data: 'patch' })
    })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PUT' })
    )
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PATCH' })
    )
  })

  it('should handle request with authentication headers', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test', { 
        headers: { 
          'Authorization': 'Bearer token123',
          'Content-Type': 'application/json'
        } 
      })
    })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer token123',
          'Content-Type': 'application/json'
        })
      })
    )
  })

  it('should handle request with form data', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    const formData = new FormData()
    formData.append('file', new Blob(['test']))
    formData.append('name', 'test-file')

    await act(async () => {
      await result.current.post('/upload', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      })
    })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: formData,
        headers: expect.objectContaining({
          'Content-Type': 'multipart/form-data'
        })
      })
    )
  })

  it('should handle request with custom timeout', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test', { timeout: 5000 })
    })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        signal: expect.any(AbortSignal)
      })
    )
  })

  it('should handle request with retry logic', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test', { retries: 2 })
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result.current.error).toBe(null)
  })

  it('should handle request with custom base URL', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi({ baseURL: 'https://api.example.com' }))

    await act(async () => {
      await result.current.get('/test')
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.any(Object)
    )
  })

  it('should handle request with custom request interceptor', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const interceptor = jest.fn((config: unknown) => ({
      ...config,
      headers: { ...(config as { headers: Record<string, string> }).headers, 'X-Custom': 'value' }
    }))

    const { result } = renderHook(() => useApi({ requestInterceptor: interceptor }))

    await act(async () => {
      await result.current.get('/test')
    })

    expect(interceptor).toHaveBeenCalled()
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Custom': 'value'
        })
      })
    )
  })

  it('should handle request with custom response interceptor', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const interceptor = jest.fn((response: unknown) => ({
      ...response,
      customField: 'intercepted'
    }))

    const { result } = renderHook(() => useApi({ responseInterceptor: interceptor }))

    await act(async () => {
      const response = await result.current.get('/test')
      expect(response).toEqual({ success: true, customField: 'intercepted' })
    })

    expect(interceptor).toHaveBeenCalled()
  })

  it('should handle request with custom error handler', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Custom error'))
    global.fetch = mockFetch

    const errorHandler = jest.fn()

    const { result } = renderHook(() => useApi({ errorHandler }))

    await act(async () => {
      await result.current.get('/test')
    })

    expect(errorHandler).toHaveBeenCalledWith('Custom error')
    expect(result.current.error).toBe('Custom error')
  })

  it('should handle request with custom success handler', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const successHandler = jest.fn()

    const { result } = renderHook(() => useApi({ successHandler }))

    await act(async () => {
      await result.current.get('/test')
    })

    expect(successHandler).toHaveBeenCalledWith({ success: true })
    expect(result.current.error).toBe(null)
  })

  it('should handle request with custom loading state', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    act(() => {
      result.current.get('/test')
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
  })

  it('should handle request with custom error state', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Test error'))
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.get('/test')
    })

    expect(result.current.error).toBe('Test error')
    expect(result.current.loading).toBe(false)
  })

  it('should handle request with custom data state', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: 'test data' })
    }
    const mockFetch = jest.fn().mockResolvedValue(mockResponse)
    global.fetch = mockFetch

    const { result } = renderHook(() => useApi())

    await act(async () => {
      const response = await result.current.get('/test')
      expect(response).toEqual({ data: 'test data' })
    })

    expect(result.current.error).toBe(null)
    expect(result.current.loading).toBe(false)
  })
}) 