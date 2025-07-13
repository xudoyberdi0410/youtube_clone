import { renderHook, act, waitFor } from '@testing-library/react'
import { useInfiniteVideos } from '@/hooks/use-infinite-videos'
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
  mapApiVideoToVideo: jest.fn((video) => ({
    ...video,
    id: video.id,
    title: video.video_title || video.title,
    description: video.video_description || video.description,
    views: video.video_views || video.views,
    channelName: video.channel_name || video.channelName,
    thumbnail: video.thumbnail_path || video.thumbnail,
    videoUrl: video.file_path || video.videoUrl,
    duration: video.duration_video || video.duration,
    createdAt: video.created_at || video.createdAt,
    likes: video.like_amount || video.likes,
    dislikes: video.dislike_amount || video.dislikes,
    category: video.category || 'Other'
  }))
}))

describe('useInfiniteVideos', () => {
  const mockApiClient = {
    getVideos: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(ApiClient.getInstance as jest.Mock).mockReturnValue(mockApiClient)
  })

  it('should initialize with default state', async () => {
    mockApiClient.getVideos.mockResolvedValue([])
    
    const { result } = renderHook(() => useInfiniteVideos())

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.videos).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isLoadingMore).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.hasMore).toBe(true)
    expect(result.current.currentPage).toBe(1)
  })

  it('should load initial videos', async () => {
    const mockApiVideos = [
      { 
        id: 1, 
        video_title: 'Video 1',
        video_description: 'Description 1',
        video_views: 100,
        channel_name: 'Channel 1',
        file_path: '/videos/1.mp4',
        thumbnail_path: '/thumbnails/1.jpg',
        duration_video: '02:00',
        created_at: '2023-01-01T00:00:00Z',
        like_amount: 10,
        dislike_amount: 2,
        category: 'Music'
      },
      { 
        id: 2, 
        video_title: 'Video 2',
        video_description: 'Description 2',
        video_views: 200,
        channel_name: 'Channel 2',
        file_path: '/videos/2.mp4',
        thumbnail_path: '/thumbnails/2.jpg',
        duration_video: '03:00',
        created_at: '2023-01-02T00:00:00Z',
        like_amount: 20,
        dislike_amount: 5,
        category: 'Gaming'
      }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useInfiniteVideos({ pageSize: 2 }))

    // Ждем загрузки после гидратации
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.videos).toHaveLength(2)
    expect(result.current.hasMore).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should load videos with custom page size', async () => {
    const mockApiVideos = [
      { 
        id: 1, 
        video_title: 'Video 1',
        video_description: 'Description 1',
        video_views: 100,
        channel_name: 'Channel 1',
        file_path: '/videos/1.mp4',
        thumbnail_path: '/thumbnails/1.jpg',
        duration_video: '02:00',
        created_at: '2023-01-01T00:00:00Z',
        like_amount: 10,
        dislike_amount: 2,
        category: 'Music'
      }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useInfiniteVideos({ pageSize: 1 }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.videos).toHaveLength(1)
    expect(result.current.hasMore).toBe(true)
  })

  it('should load videos with category filter', async () => {
    const mockApiVideos = [
      { 
        id: 1, 
        video_title: 'Gaming Video',
        video_description: 'Gaming Description',
        video_views: 100,
        channel_name: 'Gaming Channel',
        file_path: '/videos/1.mp4',
        thumbnail_path: '/thumbnails/1.jpg',
        duration_video: '02:00',
        created_at: '2023-01-01T00:00:00Z',
        like_amount: 10,
        dislike_amount: 2,
        category: 'Gaming'
      }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useInfiniteVideos({ category: 'Gaming' }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockApiClient.getVideos).toHaveBeenCalledWith(undefined, 'Gaming')
    expect(result.current.videos).toHaveLength(1)
  })

  it('should load videos with ident filter', async () => {
    const mockApiVideos = [
      { 
        id: 1, 
        video_title: 'Video 1',
        video_description: 'Description 1',
        video_views: 100,
        channel_name: 'Channel 1',
        file_path: '/videos/1.mp4',
        thumbnail_path: '/thumbnails/1.jpg',
        duration_video: '02:00',
        created_at: '2023-01-01T00:00:00Z',
        like_amount: 10,
        dislike_amount: 2,
        category: 'Music'
      }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useInfiniteVideos({ ident: 123 }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockApiClient.getVideos).toHaveBeenCalledWith(123, undefined)
    expect(result.current.videos).toHaveLength(1)
  })

  it('should handle API error', async () => {
    mockApiClient.getVideos.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useInfiniteVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('API Error')
    expect(result.current.isLoading).toBe(false)
  })

  it('should load more videos when loadMore is called', async () => {
    const mockApiVideos = [
      { 
        id: 1, 
        video_title: 'Video 1',
        video_description: 'Description 1',
        video_views: 100,
        channel_name: 'Channel 1',
        file_path: '/videos/1.mp4',
        thumbnail_path: '/thumbnails/1.jpg',
        duration_video: '02:00',
        created_at: '2023-01-01T00:00:00Z',
        like_amount: 10,
        dislike_amount: 2,
        category: 'Music'
      },
      { 
        id: 2, 
        video_title: 'Video 2',
        video_description: 'Description 2',
        video_views: 200,
        channel_name: 'Channel 2',
        file_path: '/videos/2.mp4',
        thumbnail_path: '/thumbnails/2.jpg',
        duration_video: '03:00',
        created_at: '2023-01-02T00:00:00Z',
        like_amount: 20,
        dislike_amount: 5,
        category: 'Gaming'
      }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useInfiniteVideos({ pageSize: 1 }))

    // Ждем начальной загрузки
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Загружаем еще видео
    await act(async () => {
      result.current.loadMore()
    })

    // Ждем загрузки дополнительных видео
    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false)
    })

    // Should have videos from both pages with unique IDs
    expect(result.current.videos.length).toBe(2) // 1 from first page + 1 from second page
    expect(result.current.currentPage).toBe(2)
    expect(result.current.videos[1].id).toContain('-2-0') // UniqueID for second page
  })

  it('should not load more when already loading', async () => {
    const mockApiVideos = [
      { 
        id: 1, 
        video_title: 'Video 1',
        video_description: 'Description 1',
        video_views: 100,
        channel_name: 'Channel 1',
        file_path: '/videos/1.mp4',
        thumbnail_path: '/thumbnails/1.jpg',
        duration_video: '02:00',
        created_at: '2023-01-01T00:00:00Z',
        like_amount: 10,
        dislike_amount: 2,
        category: 'Music'
      }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useInfiniteVideos({ pageSize: 1 }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Вызываем loadMore дважды подряд
    await act(async () => {
      result.current.loadMore()
      result.current.loadMore() // Второй вызов должен быть проигнорирован
    })

    // Should only call loadMore once
    expect(result.current.currentPage).toBe(2)
  })

  it('should refetch videos and reset state', async () => {
    const mockApiVideos = [
      { 
        id: 1, 
        video_title: 'Video 1',
        video_description: 'Description 1',
        video_views: 100,
        channel_name: 'Channel 1',
        file_path: '/videos/1.mp4',
        thumbnail_path: '/thumbnails/1.jpg',
        duration_video: '02:00',
        created_at: '2023-01-01T00:00:00Z',
        like_amount: 10,
        dislike_amount: 2,
        category: 'Music'
      }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useInfiniteVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Загружаем еще видео
    await act(async () => {
      result.current.loadMore()
    })

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false)
    })

    expect(result.current.currentPage).toBe(2)

    // Refetch
    await act(async () => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.currentPage).toBe(1)
    expect(result.current.videos).toHaveLength(1)
  })

  it('should change category and reset state', async () => {
    const mockApiVideos = [
      { 
        id: 1, 
        video_title: 'Video 1',
        video_description: 'Description 1',
        video_views: 100,
        channel_name: 'Channel 1',
        file_path: '/videos/1.mp4',
        thumbnail_path: '/thumbnails/1.jpg',
        duration_video: '02:00',
        created_at: '2023-01-01T00:00:00Z',
        like_amount: 10,
        dislike_amount: 2,
        category: 'Gaming'
      }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useInfiniteVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Change category
    await act(async () => {
      result.current.changeCategory('Gaming')
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockApiClient.getVideos).toHaveBeenCalledWith(undefined, 'Gaming')
    expect(result.current.currentPage).toBe(1)
  })

  it('should handle cyclic video repetition for infinite scroll', async () => {
    const mockApiVideos = [
      { 
        id: 1, 
        video_title: 'Video 1',
        video_description: 'Description 1',
        video_views: 100,
        channel_name: 'Channel 1',
        file_path: '/videos/1.mp4',
        thumbnail_path: '/thumbnails/1.jpg',
        duration_video: '02:00',
        created_at: '2023-01-01T00:00:00Z',
        like_amount: 10,
        dislike_amount: 2,
        category: 'Music'
      }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useInfiniteVideos({ pageSize: 1 }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Загружаем видео несколько раз для проверки циклического повторения
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        result.current.loadMore()
      })
      
      await waitFor(() => {
        expect(result.current.isLoadingMore).toBe(false)
      })
    }

    // Should have 6 videos (1 initial + 5 more)
    expect(result.current.videos.length).toBe(6)
    expect(result.current.currentPage).toBe(6)
    
    // Videos should repeat cyclically with unique IDs
    expect(result.current.videos[0].id).toBe(1)
    expect(result.current.videos[1].id).toContain('-2-0')
    expect(result.current.videos[2].id).toContain('-3-0')
  })

  it('should abort previous request when new request is made', async () => {
    const mockApiVideos = [
      { 
        id: 1, 
        video_title: 'Video 1',
        video_description: 'Description 1',
        video_views: 100,
        channel_name: 'Channel 1',
        file_path: '/videos/1.mp4',
        thumbnail_path: '/thumbnails/1.jpg',
        duration_video: '02:00',
        created_at: '2023-01-01T00:00:00Z',
        like_amount: 10,
        dislike_amount: 2,
        category: 'Music'
      }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useInfiniteVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Change category to trigger new request
    await act(async () => {
      result.current.changeCategory('Gaming')
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockApiClient.getVideos).toHaveBeenCalledTimes(2)
  })

  it('should ignore AbortError when request is cancelled', async () => {
    const mockApiVideos = [
      { 
        id: 1, 
        video_title: 'Video 1',
        video_description: 'Description 1',
        video_views: 100,
        channel_name: 'Channel 1',
        file_path: '/videos/1.mp4',
        thumbnail_path: '/thumbnails/1.jpg',
        duration_video: '02:00',
        created_at: '2023-01-01T00:00:00Z',
        like_amount: 10,
        dislike_amount: 2,
        category: 'Music'
      }
    ]

    mockApiClient.getVideos.mockResolvedValue(mockApiVideos)

    const { result } = renderHook(() => useInfiniteVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Change category to trigger new request (this will abort the previous one)
    await act(async () => {
      result.current.changeCategory('Gaming')
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Should not set error for aborted requests
    expect(result.current.error).toBe(null)
  })
}) 