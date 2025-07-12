import { renderHook, waitFor, act } from '@testing-library/react'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { getCurrentUser, getAuthToken, shouldRefreshToken, ensureValidToken } from '@/modules/auth/lib/auth-utils'

// Mock auth utils
jest.mock('@/modules/auth/lib/auth-utils', () => ({
  getCurrentUser: jest.fn(),
  getAuthToken: jest.fn(),
  shouldRefreshToken: jest.fn(),
  ensureValidToken: jest.fn(),
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

// Mock window.dispatchEvent
Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
  writable: true,
})

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorageMock.getItem.mockReturnValue(null)
    sessionStorageMock.setItem.mockImplementation(() => {})
    sessionStorageMock.removeItem.mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should initialize with default state when no token exists', () => {
    ;(getAuthToken as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.user).toBe(null)
    expect(result.current.loading).toBe(false)
  })

  it('should initialize with cached auth data from sessionStorage', async () => {
    const cachedAuth = {
      isLoggedIn: true,
      user: { id: 1, username: 'testuser', email: 'test@example.com' }
    }
    sessionStorageMock.getItem.mockReturnValue(JSON.stringify(cachedAuth))
    ;(getAuthToken as jest.Mock).mockImplementation(() => 'valid-token')
    ;(getCurrentUser as jest.Mock).mockResolvedValue(cachedAuth.user)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.isLoggedIn).toBe(true)
    })
    expect(result.current.user).toEqual(cachedAuth.user)
  })

  it('should handle token refresh when token expires soon', async () => {
    ;(getAuthToken as jest.Mock).mockReturnValue('valid-token')
    ;(shouldRefreshToken as jest.Mock).mockReturnValue(true)
    ;(ensureValidToken as jest.Mock).mockResolvedValue(true)
    ;(getCurrentUser as jest.Mock).mockResolvedValue({
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(ensureValidToken).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(true)
      expect(result.current.user).toBeTruthy()
      expect(result.current.loading).toBe(false)
    })
  })

  it('should handle failed token refresh', async () => {
    ;(getAuthToken as jest.Mock).mockReturnValue('valid-token')
    ;(shouldRefreshToken as jest.Mock).mockReturnValue(true)
    ;(ensureValidToken as jest.Mock).mockResolvedValue(false)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(false)
      expect(result.current.user).toBe(null)
      expect(result.current.loading).toBe(false)
    })
  })

  it('should handle successful user data fetch', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }
    ;(getAuthToken as jest.Mock).mockReturnValue('valid-token')
    ;(shouldRefreshToken as jest.Mock).mockReturnValue(false)
    ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.loading).toBe(false)
    })

    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
      'auth_cache',
      JSON.stringify({ isLoggedIn: true, user: mockUser })
    )
  })

  it('should handle failed user data fetch', async () => {
    ;(getAuthToken as jest.Mock).mockReturnValue('valid-token')
    ;(shouldRefreshToken as jest.Mock).mockReturnValue(false)
    ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(false)
      expect(result.current.user).toBe(null)
      expect(result.current.loading).toBe(false)
    })

    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('auth_cache')
  })

  it('should handle auth error', async () => {
    ;(getAuthToken as jest.Mock).mockReturnValue('valid-token')
    ;(shouldRefreshToken as jest.Mock).mockReturnValue(false)
    ;(getCurrentUser as jest.Mock).mockRejectedValue(new Error('Auth error'))

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(false)
      expect(result.current.user).toBe(null)
      expect(result.current.loading).toBe(false)
    })

    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('auth_cache')
  })

  it('should set up periodic token check interval', () => {
    jest.useFakeTimers()
    ;(getAuthToken as jest.Mock).mockReturnValue('valid-token')
    ;(shouldRefreshToken as jest.Mock).mockReturnValue(false)
    ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

    renderHook(() => useAuth())

    // Fast-forward time to trigger interval
    jest.advanceTimersByTime(60000)

    expect(shouldRefreshToken).toHaveBeenCalled()
  })

  it('should handle storage change events', async () => {
    ;(getAuthToken as jest.Mock).mockReturnValue('valid-token')
    ;(shouldRefreshToken as jest.Mock).mockReturnValue(false)
    ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

    const { result } = renderHook(() => useAuth())

    // Simulate storage change
    const storageEvent = new StorageEvent('storage')
    await act(async () => {
      window.dispatchEvent(storageEvent)
    })

    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('auth_cache')
  })

  it('should handle auth state change events', async () => {
    ;(getAuthToken as jest.Mock).mockReturnValue('valid-token')
    ;(shouldRefreshToken as jest.Mock).mockReturnValue(false)
    ;(getCurrentUser as jest.Mock).mockResolvedValue(null)

    const { result } = renderHook(() => useAuth())

    // Simulate auth state change
    const authEvent = new Event('authStateChanged')
    await act(async () => {
      window.dispatchEvent(authEvent)
    })

    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('auth_cache')
  })
}) 