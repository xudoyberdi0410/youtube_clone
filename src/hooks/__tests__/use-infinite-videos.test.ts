import { renderHook, act } from '@testing-library/react'
import { useInfiniteVideos } from '../use-infinite-videos'
import { ApiClient } from '@/lib/api-client'

// Мокаем ApiClient
jest.mock('@/lib/api-client', () => ({
  ApiClient: {
    getInstance: jest.fn(() => ({
      getVideos: jest.fn()
    }))
  }
}))

// Мокаем mapApiVideoToVideo
jest.mock('@/lib/utils/video-mapper', () => ({
  mapApiVideoToVideo: jest.fn((video) => video)
}))

describe('useInfiniteVideos', () => {
  const mockApiClient = {
    getVideos: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(ApiClient.getInstance as jest.Mock).mockReturnValue(mockApiClient)
  })

  it('should load initial videos', async () => {
    const mockVideos = [
      { id: 1, title: 'Video 1' },
      { id: 2, title: 'Video 2' },
      { id: 3, title: 'Video 3' }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockVideos)

    const { result } = renderHook(() => useInfiniteVideos({ pageSize: 2 }))

    // Ждем загрузки
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.videos).toHaveLength(2) // Первые 2 видео
    expect(result.current.hasMore).toBe(true) // Есть еще видео
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle errors gracefully', async () => {
    mockApiClient.getVideos.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useInfiniteVideos())

    // Ждем загрузки
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBe('API Error')
    expect(result.current.isLoading).toBe(false)
  })

  it('should load more videos when loadMore is called', async () => {
    const mockVideos = [
      { id: 1, title: 'Video 1' },
      { id: 2, title: 'Video 2' },
      { id: 3, title: 'Video 3' },
      { id: 4, title: 'Video 4' }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockVideos)

    const { result } = renderHook(() => useInfiniteVideos({ pageSize: 2 }))

    // Ждем начальной загрузки
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Загружаем еще видео
    await act(async () => {
      result.current.loadMore()
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.videos).toHaveLength(4) // Все 4 видео
    expect(result.current.hasMore).toBe(false) // Больше нет видео
  })
}) 