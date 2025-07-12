import { renderHook, act, waitFor } from '@testing-library/react'
import { useLikedVideos } from '@/hooks/use-liked-videos'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { ApiClient } from '@/lib/api-client'

// Mock dependencies
jest.mock('@/modules/auth/hooks/use-auth')
jest.mock('@/lib/api-client')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockApiClient = {
  getLikes: jest.fn(),
  deleteLike: jest.fn(),
}

describe('useLikedVideos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(ApiClient.getInstance as jest.Mock).mockReturnValue(mockApiClient)
  })

  it('should initialize with default state', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      requireAuth: jest.fn(),
      user: null,
      loading: false,
      isLoggedIn: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    const { result } = renderHook(() => useLikedVideos())

    expect(result.current.likedVideos).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should load liked videos when authenticated', async () => {
    const mockLikes = [
      {
        id: 1,
        user_id: 1,
        video_id: 1,
        is_like: true,
        created_at: '2023-01-01T00:00:00Z',
        video: {
          id: 1,
          video_title: 'Test Video 1',
          video_description: 'Description 1',
          video_views: 100,
          channel_name: 'Test Channel',
          file_path: '/videos/1.mp4',
          thumbnail_path: '/thumbnails/1.jpg',
          duration_video: '02:00',
          created_at: '2023-01-01T00:00:00Z',
          like_amount: 10,
          dislike_amount: 2,
          category: 'Music'
        }
      },
      {
        id: 2,
        user_id: 1,
        video_id: 2,
        is_like: true,
        created_at: '2023-01-02T00:00:00Z',
        video: {
          id: 2,
          video_title: 'Test Video 2',
          video_description: 'Description 2',
          video_views: 200,
          channel_name: 'Test Channel',
          file_path: '/videos/2.mp4',
          thumbnail_path: '/thumbnails/2.jpg',
          duration_video: '03:00',
          created_at: '2023-01-02T00:00:00Z',
          like_amount: 20,
          dislike_amount: 5,
          category: 'Gaming'
        }
      },
      {
        id: 3,
        user_id: 1,
        video_id: 3,
        is_like: false, // This should be filtered out
        created_at: '2023-01-03T00:00:00Z',
        video: {
          id: 3,
          video_title: 'Test Video 3',
          video_description: 'Description 3',
          video_views: 300,
          channel_name: 'Test Channel',
          file_path: '/videos/3.mp4',
          thumbnail_path: '/thumbnails/3.jpg',
          duration_video: '04:00',
          created_at: '2023-01-03T00:00:00Z',
          like_amount: 30,
          dislike_amount: 8,
          category: 'Education'
        }
      }
    ]

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: jest.fn(),
      user: { id: 1, username: 'testuser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    mockApiClient.getLikes.mockResolvedValue(mockLikes)

    const { result } = renderHook(() => useLikedVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.likedVideos).toHaveLength(2) // Only likes with is_like: true
    expect(result.current.likedVideos[0].id).toBe(1)
    expect(result.current.likedVideos[1].id).toBe(2)
    expect(result.current.error).toBe(null)
  })

  it('should handle array response from API', async () => {
    const mockLikesArray = [
      {
        id: 1,
        user_id: 1,
        video_id: 1,
        is_like: true,
        created_at: '2023-01-01T00:00:00Z'
      }
    ]

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: jest.fn(),
      user: { id: 1, username: 'testuser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    mockApiClient.getLikes.mockResolvedValue(mockLikesArray)

    const { result } = renderHook(() => useLikedVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.likedVideos).toHaveLength(1)
    expect(result.current.likedVideos[0].id).toBe(1)
  })

  it('should handle object response from API', async () => {
    const mockLikesObject = {
      '1': {
        id: 1,
        user_id: 1,
        video_id: 1,
        is_like: true,
        created_at: '2023-01-01T00:00:00Z'
      },
      '2': {
        id: 2,
        user_id: 1,
        video_id: 2,
        is_like: true,
        created_at: '2023-01-02T00:00:00Z'
      }
    }

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: jest.fn(),
      user: { id: 1, username: 'testuser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    mockApiClient.getLikes.mockResolvedValue(mockLikesObject)

    const { result } = renderHook(() => useLikedVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.likedVideos).toHaveLength(2)
    expect(result.current.likedVideos[0].id).toBe(1)
    expect(result.current.likedVideos[1].id).toBe(2)
  })

  it('should handle API error when loading liked videos', async () => {
    const errorMessage = 'Failed to fetch liked videos'
    mockApiClient.getLikes.mockRejectedValue(new Error(errorMessage))

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: jest.fn(),
      user: { id: 1, username: 'testuser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    const { result } = renderHook(() => useLikedVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.likedVideos).toEqual([])
  })

  it('should not load liked videos when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      requireAuth: jest.fn(),
      user: null,
      loading: false,
      isLoggedIn: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    renderHook(() => useLikedVideos())

    expect(mockApiClient.getLikes).not.toHaveBeenCalled()
  })

  it('should remove like successfully', async () => {
    const initialLikes = [
      {
        id: 1,
        user_id: 1,
        video_id: 1,
        is_like: true,
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        user_id: 1,
        video_id: 2,
        is_like: true,
        created_at: '2023-01-02T00:00:00Z'
      }
    ]

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: jest.fn(),
      user: { id: 1, username: 'testuser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    mockApiClient.getLikes.mockResolvedValue(initialLikes)
    mockApiClient.deleteLike.mockResolvedValue(undefined)

    const { result } = renderHook(() => useLikedVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.likedVideos).toHaveLength(2)

    // Remove like
    const removeResult = await act(async () => {
      return await result.current.removeLike(1)
    })

    expect(removeResult).toBe(true)
    expect(mockApiClient.deleteLike).toHaveBeenCalledWith(1)
    expect(result.current.likedVideos).toHaveLength(1)
    expect(result.current.likedVideos[0].id).toBe(2)
    expect(result.current.error).toBe(null)
  })

  it('should handle error when removing like', async () => {
    const errorMessage = 'Failed to remove like'
    mockApiClient.deleteLike.mockRejectedValue(new Error(errorMessage))

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: jest.fn(),
      user: { id: 1, username: 'testuser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    const { result } = renderHook(() => useLikedVideos())

    const removeResult = await act(async () => {
      return await result.current.removeLike(1)
    })

    expect(removeResult).toBe(false)
    expect(result.current.error).toBe(errorMessage)
  })

  it('should handle non-Error exceptions', async () => {
    mockApiClient.getLikes.mockRejectedValue('String error')

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: jest.fn(),
      user: { id: 1, username: 'testuser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    const { result } = renderHook(() => useLikedVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to load liked videos')
  })

  it('should handle empty response from API', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: jest.fn(),
      user: { id: 1, username: 'testuser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    mockApiClient.getLikes.mockResolvedValue([])

    const { result } = renderHook(() => useLikedVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.likedVideos).toEqual([])
    expect(result.current.error).toBe(null)
  })

  it('should handle null response from API', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: jest.fn(),
      user: { id: 1, username: 'testuser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    mockApiClient.getLikes.mockResolvedValue(null)

    const { result } = renderHook(() => useLikedVideos())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.likedVideos).toEqual([])
    expect(result.current.error).toBe(null)
  })

  it('should reload liked videos when authentication state changes', async () => {
    const mockLikes = [
      {
        id: 1,
        user_id: 1,
        video_id: 1,
        is_like: true,
        created_at: '2023-01-01T00:00:00Z'
      }
    ]

    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      requireAuth: jest.fn(),
      user: null,
      loading: false,
      isLoggedIn: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    const { result, rerender } = renderHook(() => useLikedVideos())

    expect(mockApiClient.getLikes).not.toHaveBeenCalled()

    // Change authentication state
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: jest.fn(),
      user: { id: 1, username: 'testuser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    mockApiClient.getLikes.mockResolvedValue(mockLikes)

    rerender()

    await waitFor(() => {
      expect(mockApiClient.getLikes).toHaveBeenCalled()
    })
  })
}) 