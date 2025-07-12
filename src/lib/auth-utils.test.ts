import { getCurrentUserId, isUserAuthenticated } from './auth-utils'

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

describe('Auth Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCurrentUserId', () => {
    it('returns null when window is undefined (SSR)', () => {
      const originalWindow = global.window
      delete (global as any).window

      const result = getCurrentUserId()

      expect(result).toBeNull()

      global.window = originalWindow
    })

    it('returns null when no token is stored', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = getCurrentUserId()

      expect(result).toBeNull()
      expect(localStorageMock.getItem).toHaveBeenCalledWith('access_token')
    })

    it('extracts user ID from JWT token with sub claim', () => {
      const mockToken = 'header.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature'
      localStorageMock.getItem.mockReturnValue(mockToken)

      const result = getCurrentUserId()

      expect(result).toBe("1234567890")
    })

    it('extracts user ID from JWT token with user_id claim', () => {
      const payload = { user_id: 42, name: 'Test User' }
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`
      localStorageMock.getItem.mockReturnValue(mockToken)

      const result = getCurrentUserId()

      expect(result).toBe(42)
    })

    it('extracts user ID from JWT token with id claim', () => {
      const payload = { id: 99, name: 'Test User' }
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`
      localStorageMock.getItem.mockReturnValue(mockToken)

      const result = getCurrentUserId()

      expect(result).toBe(99)
    })

    it('returns fallback ID when token decoding fails', () => {
      const mockToken = 'invalid.token.format'
      localStorageMock.getItem.mockReturnValue(mockToken)

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const result = getCurrentUserId()

      expect(result).toBe(1)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to decode token:', expect.any(Error))

      consoleSpy.mockRestore()
    })

    it('returns fallback ID when token has no user ID claims', () => {
      const payload = { name: 'Test User', role: 'admin' }
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`
      localStorageMock.getItem.mockReturnValue(mockToken)

      const result = getCurrentUserId()

      expect(result).toBe(1)
    })
  })

  describe('isUserAuthenticated', () => {
    it('returns false when window is undefined (SSR)', () => {
      const originalWindow = global.window
      delete (global as any).window

      const result = isUserAuthenticated()

      expect(result).toBe(false)

      global.window = originalWindow
    })

    it('returns false when no token is stored', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = isUserAuthenticated()

      expect(result).toBe(false)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('access_token')
    })

    it('returns true when token is stored', () => {
      localStorageMock.getItem.mockReturnValue('valid.token.here')

      const result = isUserAuthenticated()

      expect(result).toBe(true)
    })

    it('returns false when token is empty string', () => {
      localStorageMock.getItem.mockReturnValue('')

      const result = isUserAuthenticated()

      expect(result).toBe(false)
    })
  })
}) 