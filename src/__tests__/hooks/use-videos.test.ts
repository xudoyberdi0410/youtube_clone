import { renderHook, waitFor } from '@testing-library/react'
import { useVideos } from '@/hooks/use-videos'
import { ApiClient } from '@/lib/api-client'
import { mapApiVideoToVideo } from '@/lib/utils/video-mapper'

// Mock API client
jest.mock('@/lib/api-client', () => ({
  ApiClient: {
    getInstance: jest.fn(),
  },
}))

// Mock video mapper
jest.mock('@/lib/utils/video-mapper', () => ({
  mapApiVideoToVideo: jest.fn(),
}))

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
})

describe('useVideos', () => {
  const mockApiClient = {
    getVideos: jest.fn(),
  }

  const mockApiVideos = [
    {
      id: 1,
      title: 'Test Video 1',
      description: 'Test Description 1',
      video_url: 'https://example.com/video1.mp4',
      thumbnail_url: 'https://example.com/thumb1.jpg',
      views: 1000,
      likes: 100,
      dislikes: 10,
      created_at: '2024-01-01T00:00:00Z',
      user: {
        id: 1,
        username: 'testuser',
        avatar_url: 'https://example.com/avatar.jpg',
      },
    },
    {
      id: 2,
      title: 'Test Video 2',
      description: 'Test Description 2',
      video_url: 'https://example.com/video2.mp4',
      thumbnail_url: 'https://example.com/thumb2.jpg',
      views: 2000,
      likes: 200,
      dislikes: 20,
      created_at: '2024-01-02T00:00:00Z',
      user: {
        id: 2,
        username: 'testuser2',
        avatar_url: 'https://example.com/avatar2.jpg',
      },
    },
  ]

  const mockMappedVideos = [
    {
      id: '1',
      title: 'Test Video 1',
      description: 'Test Description 1',
      videoUrl: 'https://example.com/video1.mp4',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      views: 1000,
      likes: 100,
      dislikes: 10,
      publishDate: '2024-01-01T00:00:00Z',
      channelName: 'testuser',
      channelAvatar: 'https://example.com/avatar.jpg',
      channelId: '1',
    },
    {
      id: '2',
      title: 'Test Video 2',
      description: 'Test Description 2',
      videoUrl: 'https://example.com/video2.mp4',
      thumbnailUrl: 'https://example.com/thumb2.jpg',
      views: 2000,
      likes: 200,
      dislikes: 20,
      publishDate: '2024-01-02T00:00:00Z',
      channelName: 'testuser2',
      channelAvatar: 'https://example.com/avatar2.jpg',
      channelId: '2',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(ApiClient.getInstance as jest.Mock).mockReturnValue(mockApiClient)
    ;(mapApiVideoToVideo as jest.Mock).mockImplementation((video, index) => mockMappedVideos[index])
    sessionStorageMock.getItem.mockReturnValue(null)
    sessionStorageMock.setItem.mockImplementation(() => {})
  })

  it('should initialize with default state', async () => {
    mockApiClient.getVideos.mockResolvedValue([])
    ;(mapApiVideoToVideo as jest.Mock).mockImplementation((videos) => videos ? videos : [])
    
    const { result } = renderHook(() => useVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.videos).toEqual([])
    expect(result.current.error).toBe(null)
  })

  it('should load videos from cache when available and not expired', () => {
    const cachedVideos = mockMappedVideos
    const cacheTimestamp = Date.now().toString()
    
    sessionStorageMock.getItem
      .mockReturnValueOnce(JSON.stringify(cachedVideos)) // CACHE_KEY
      .mockReturnValueOnce(cacheTimestamp) // CACHE_TIMESTAMP_KEY

    const { result } = renderHook(() => useVideos({ immediate: true }))

    expect(result.current.videos).toEqual(cachedVideos)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should load videos from API when cache is expired', async () => {
    const expiredTimestamp = (Date.now() - 6 * 60 * 1000).toString() // 6 minutes ago
    
    sessionStorageMock.getItem
      .mockReturnValueOnce(JSON.stringify(mockMappedVideos)) // CACHE_KEY
      .mockReturnValueOnce(expiredTimestamp) // CACHE_TIMESTAMP_KEY

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useVideos({ immediate: true }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockApiClient.getVideos).toHaveBeenCalled()
    expect(result.current.videos).toEqual(mockMappedVideos)
  })

  it('should load videos from API when no cache exists', async () => {
    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useVideos({ immediate: true }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockApiClient.getVideos).toHaveBeenCalled()
    expect(result.current.videos).toEqual(mockMappedVideos)
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
      'youtube_videos_cache',
      JSON.stringify(mockMappedVideos)
    )
  })

  it('should handle API error', async () => {
    const errorMessage = 'Failed to fetch videos'
    mockApiClient.getVideos.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useVideos({ immediate: true }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.videos).toEqual([])
  })

  it('should not load videos immediately when immediate is false', () => {
    const { result } = renderHook(() => useVideos({ immediate: false }))

    expect(mockApiClient.getVideos).not.toHaveBeenCalled()
    expect(result.current.videos).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it('should load videos with category filter', async () => {
    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useVideos({ 
      category: 'music',
      immediate: true 
    }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockApiClient.getVideos).toHaveBeenCalledWith(undefined, 'music')
  })

  it('should load videos with ident filter', async () => {
    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useVideos({ 
      ident: 123,
      immediate: true 
    }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockApiClient.getVideos).toHaveBeenCalledWith(123, undefined)
  })

  it('should refetch videos when refetch is called', async () => {
    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useVideos({ immediate: false }))

    result.current.refetch()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockApiClient.getVideos).toHaveBeenCalled()
  })

  it('should change category and reload videos', async () => {
    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useVideos({ immediate: false }))

    result.current.changeCategory('gaming')

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockApiClient.getVideos).toHaveBeenCalledWith(undefined, 'gaming')
  })

  it('should not cache videos when category or ident is specified', async () => {
    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useVideos({ 
      category: 'music',
      immediate: true 
    }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Should not cache filtered results
    expect(sessionStorageMock.setItem).not.toHaveBeenCalledWith(
      'youtube_videos_cache',
      expect.any(String)
    )
  })

  it('should handle cache read error gracefully', () => {
    sessionStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage error')
    })

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useVideos({ immediate: true }))

    // Should not throw error and should fall back to API
    expect(result.current.videos).toEqual([])
  })

  it('should handle cache write error gracefully', async () => {
    sessionStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage error')
    })

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useVideos({ immediate: true }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Should not throw error and should still return videos
    expect(result.current.videos).toEqual(mockMappedVideos)
  })
}) 