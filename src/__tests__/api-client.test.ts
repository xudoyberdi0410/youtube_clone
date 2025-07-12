import { ApiClient, ApiError } from '../lib/api-client'
import type { User, Video, Channel } from '../types/api'

// Mock fetch для тестирования
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.dispatchEvent
Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
  writable: true,
})

// Helper function to create mock Response
const createMockResponse = (data: any, ok: boolean = true, status: number = 200) => ({
  ok,
  status,
  json: jest.fn().mockResolvedValue(data),
  text: jest.fn().mockResolvedValue(JSON.stringify(data)),
  headers: {
    get: jest.fn().mockReturnValue('application/json')
  }
})

describe('ApiClient', () => {
  let apiClient: ApiClient

  beforeEach(() => {
    apiClient = ApiClient.getInstance()
    mockFetch.mockClear()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
    ;(window.dispatchEvent as jest.Mock).mockClear()
  })

  describe('User methods', () => {
    it('should register user and return User object', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        avatar_url: 'https://example.com/avatar.jpg'
      }

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUser))

      const result = await apiClient.registerUser({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      })

      expect(result).toEqual(mockUser)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/user/post_user'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
          })
        })
      )
    })

    it('should get user and return User object', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z'
      }

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUser))

      const result = await apiClient.getUser()

      expect(result).toEqual(mockUser)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/user/get_user'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })
  })

  describe('Video methods', () => {
    it('should get videos and return Video array', async () => {
      const mockVideos: Video[] = [
        {
          id: 1,
          // Используем новые поля API
          video_title: 'Test Video',
          video_description: 'Test Description',
          video_views: 100,
          channel_name: 'Test Channel',
          profile_image: 'test-avatar.jpg',
          file_path: 'videos/test.mp4',
          thumbnail_path: 'thumbnails/test.jpg',
          category: 'Texnologiya',
          like_amount: 10,
          dislike_amount: 2,
          created_at: '2025-07-03T15:30:00',
          duration: 120,
          duration_video: '02:00'
        }
      ]

      mockFetch.mockResolvedValueOnce(createMockResponse(mockVideos))

      const result = await apiClient.getVideos()

      expect(result).toEqual(mockVideos)
      expect(Array.isArray(result)).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/video/get_video'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })
  })

  describe('Error handling', () => {
    it('should throw ApiError on HTTP error', async () => {
      const errorResponse = {
        detail: 'User not found',
        message: 'Error occurred'
      }

      mockFetch.mockResolvedValueOnce(createMockResponse(errorResponse, false, 404))

      await expect(apiClient.getUser()).rejects.toThrow(ApiError)
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(apiClient.getUser()).rejects.toThrow(ApiError)
    })
  })

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ApiClient.getInstance()
      const instance2 = ApiClient.getInstance()
      
      expect(instance1).toBe(instance2)
    })
  })

  describe('Type safety', () => {
    it('should have correct return types for all methods', async () => {
      // Проверим, что методы возвращают правильные типы
      // TypeScript проверит это на этапе компиляции

      // Мокируем успешные ответы для тестирования типов
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z'
      }

      const mockVideos: Video[] = []
      const mockChannel: Channel = {
        id: 1,
        channel_name: 'Test Channel',
        description: 'Test Description',
        user_id: 1,
        created_at: '2023-01-01T00:00:00Z'
      }

      mockFetch
        .mockResolvedValueOnce(createMockResponse(mockUser))
        .mockResolvedValueOnce(createMockResponse(mockVideos))
        .mockResolvedValueOnce(createMockResponse(mockChannel))

      const userPromise = apiClient.getUser()
      const videosPromise = apiClient.getVideos()
      const channelPromise = apiClient.getMyChannel()

      const user = await userPromise
      const videos = await videosPromise
      const channel = await channelPromise

      expect(typeof user.id).toBe('number')
      expect(typeof user.username).toBe('string')
      expect(Array.isArray(videos)).toBe(true)
      expect(typeof channel.id).toBe('number')
      expect(typeof channel.channel_name).toBe('string')
    })
  })

  describe('HTTP methods', () => {
    it('should make GET request', async () => {
      const mockData = { test: 'data' }
      
      mockFetch.mockResolvedValueOnce(createMockResponse(mockData))

      const result = await apiClient.get('/test')
      
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })

    it('should make POST request', async () => {
      const mockData = { test: 'data' }
      const postData = { name: 'test' }
      
      mockFetch.mockResolvedValueOnce(createMockResponse(mockData))

      const result = await apiClient.post('/test', postData)
      
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData)
        })
      )
    })

    it('should make PUT request', async () => {
      const mockData = { test: 'data' }
      const putData = { name: 'updated' }
      
      mockFetch.mockResolvedValueOnce(createMockResponse(mockData))

      const result = await apiClient.put('/test', putData)
      
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(putData)
        })
      )
    })

    it('should make DELETE request', async () => {
      const mockData = { message: 'deleted' }
      
      mockFetch.mockResolvedValueOnce(createMockResponse(mockData))

      const result = await apiClient.delete('/test')
      
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'DELETE'
        })
      )
    })
  })
})
