import { ApiClient } from '@/lib/api-client'

// Mock fetch globally
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock environment variables
process.env.NEXT_PUBLIC_USE_PROXY = 'false'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'

// Mock buildApiUrl to return direct URLs
jest.mock('@/lib/api-config', () => ({
  ...jest.requireActual('@/lib/api-config'),
  buildApiUrl: jest.fn((endpoint: string) => `http://localhost:8000${endpoint}`),
}))

describe('ApiClient', () => {
  let apiClient: ApiClient

  beforeEach(() => {
    jest.clearAllMocks()
    apiClient = ApiClient.getInstance()
    ;(fetch as jest.Mock).mockClear()
    localStorageMock.getItem.mockReturnValue('test-token')
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})
  })

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = ApiClient.getInstance()
      const instance2 = ApiClient.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('HTTP methods', () => {
    it('should make GET request successfully', async () => {
      const mockData = { id: 1, name: 'test' }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
        headers: { get: () => 'application/json' },
      })

      const result = await apiClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/test',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
          signal: undefined,
        }
      )
      expect(result).toEqual(mockData)
    })

    it('should make POST request successfully', async () => {
      const mockData = { id: 1, name: 'test' }
      const postData = { name: 'new item' }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
        headers: { get: () => 'application/json' },
      })

      const result = await apiClient.post('/test', postData)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/test',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
          body: JSON.stringify(postData),
        }
      )
      expect(result).toEqual(mockData)
    })

    it('should make PUT request successfully', async () => {
      const mockData = { id: 1, name: 'updated' }
      const putData = { name: 'updated item' }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
        headers: { get: () => 'application/json' },
      })

      const result = await apiClient.put('/test/1', putData)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/test/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
          body: JSON.stringify(putData),
        }
      )
      expect(result).toEqual(mockData)
    })

    it('should make DELETE request successfully', async () => {
      const mockData = { success: true }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
        headers: { get: () => 'application/json' },
      })

      const result = await apiClient.delete('/test/1')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/test/1',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
          signal: undefined,
        }
      )
      expect(result).toEqual(mockData)
    })
  })

  describe('getVideos', () => {
    it('should fetch videos successfully', async () => {
      const mockVideos = [
        { id: 1, title: 'Video 1' },
        { id: 2, title: 'Video 2' },
      ]
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockVideos),
        headers: { get: () => 'application/json' },
      })

      const result = await apiClient.getVideos()

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/video/get_video',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
          signal: undefined,
        }
      )
      expect(result).toEqual(mockVideos)
    })

    it('should fetch videos with ident parameter', async () => {
      const mockVideos = [{ id: 1, title: 'Video 1' }]
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockVideos),
        headers: { get: () => 'application/json' },
      })

      await apiClient.getVideos(123)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/video/get_video?ident=123',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
          signal: undefined,
        }
      )
    })

    it('should fetch videos with category parameter', async () => {
      const mockVideos = [{ id: 1, title: 'Video 1' }]
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockVideos),
        headers: { get: () => 'application/json' },
      })

      await apiClient.getVideos(undefined, 'Music')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/video/get_video?category=Music',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
          signal: undefined,
        }
      )
    })
  })

  describe('Error handling', () => {
    it('should handle 401 unauthorized error', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn().mockResolvedValue({ message: 'Token expired' }),
      })

      await expect(apiClient.get('/test')).rejects.toThrow('Token expired')
    })

    it('should handle 404 not found error', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue({ message: 'Resource not found' }),
      })

      await expect(apiClient.get('/test')).rejects.toThrow('Resource not found')
    })

    it('should handle 500 server error', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockResolvedValue({ message: 'Server error' }),
      })

      await expect(apiClient.get('/test')).rejects.toThrow('Server error')
    })

    it('should handle network error', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(apiClient.get('/test')).rejects.toThrow('Network error')
    })
  })
}) 