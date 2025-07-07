import { ApiClient, ApiError } from '../lib/api-client'
import type { User, Video, Channel } from '../types/api'

// Mock fetch для тестирования
global.fetch = jest.fn()

describe('ApiClient', () => {
  let apiClient: ApiClient
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    apiClient = ApiClient.getInstance()
    mockFetch.mockClear()
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
        text: async () => JSON.stringify(mockUser),
      } as Response)

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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
        text: async () => JSON.stringify(mockUser),
      } as Response)

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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockVideos,
        text: async () => JSON.stringify(mockVideos),
      } as Response)

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

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => errorResponse,
        text: async () => JSON.stringify(errorResponse),
      } as Response)

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
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify(mockUser),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify(mockVideos),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify(mockChannel),
        } as Response)

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
})
