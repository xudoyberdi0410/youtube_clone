import {
  isValidEmail,
  validatePassword,
  validateFileUpload,
  isValidUrl,
  validateUsername,
  validateVideoTitle,
  sanitizeHtml
} from './validation'

// Mock constants
jest.mock('../constants', () => ({
  UPLOAD_CONFIG: {
    MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
    MAX_FILE_SIZE: 10 * 1024 * 1024,   // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg']
  }
}))

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.org')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('validates strong passwords', () => {
      const result = validatePassword('StrongPass123')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('detects missing uppercase letter', () => {
      const result = validatePassword('weakpass123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
    })

    it('detects missing lowercase letter', () => {
      const result = validatePassword('WEAKPASS123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one lowercase letter')
    })

    it('detects missing number', () => {
      const result = validatePassword('WeakPass')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one number')
    })

    it('detects too short password', () => {
      const result = validatePassword('Weak1')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters long')
    })

    it('returns multiple errors for weak password', () => {
      const result = validatePassword('weak')
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(3) // missing lowercase, uppercase, number
    })
  })

  describe('validateFileUpload', () => {
    it('validates valid image file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

      const result = validateFileUpload(file, 'image')
      expect(result.isValid).toBe(true)
    })

    it('validates valid video file', () => {
      const file = new File([''], 'test.mp4', { type: 'video/mp4' })
      Object.defineProperty(file, 'size', { value: 50 * 1024 * 1024 }) // 50MB

      const result = validateFileUpload(file, 'video')
      expect(result.isValid).toBe(true)
    })

    it('rejects oversized image file', () => {
      const file = new File([''], 'large.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 20 * 1024 * 1024 }) // 20MB

      const result = validateFileUpload(file, 'image')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('File size must be less than 10MB')
    })

    it('rejects oversized video file', () => {
      const file = new File([''], 'large.mp4', { type: 'video/mp4' })
      Object.defineProperty(file, 'size', { value: 150 * 1024 * 1024 }) // 150MB

      const result = validateFileUpload(file, 'video')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('File size must be less than 100MB')
    })

    it('rejects invalid file type', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(file, 'size', { value: 1024 })

      const result = validateFileUpload(file, 'image')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Invalid file type')
    })
  })

  describe('isValidUrl', () => {
    it('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(isValidUrl('https://sub.domain.co.uk/path?param=value')).toBe(true)
    })

    it('rejects invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('http://')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('validateUsername', () => {
    it('validates correct usernames', () => {
      expect(validateUsername('john_doe')).toEqual({ isValid: true })
      expect(validateUsername('user123')).toEqual({ isValid: true })
      expect(validateUsername('test-user')).toEqual({ isValid: true })
    })

    it('rejects too short username', () => {
      const result = validateUsername('ab')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Username must be at least 3 characters long')
    })

    it('rejects too long username', () => {
      const result = validateUsername('a'.repeat(21))
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Username must be no longer than 20 characters')
    })

    it('rejects username with invalid characters', () => {
      const result = validateUsername('user@name')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Username can only contain letters, numbers, underscores, and hyphens')
    })
  })

  describe('validateVideoTitle', () => {
    it('validates correct video titles', () => {
      expect(validateVideoTitle('My Awesome Video')).toEqual({ isValid: true })
      expect(validateVideoTitle('A'.repeat(100))).toEqual({ isValid: true })
    })

    it('rejects empty title', () => {
      const result = validateVideoTitle('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Title is required')
    })

    it('rejects whitespace-only title', () => {
      const result = validateVideoTitle('   ')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Title is required')
    })

    it('rejects too long title', () => {
      const result = validateVideoTitle('A'.repeat(101))
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Title must be no longer than 100 characters')
    })

    it('trims whitespace from title', () => {
      const result = validateVideoTitle('  Valid Title  ')
      expect(result.isValid).toBe(true)
    })
  })

  describe('sanitizeHtml', () => {
    it('sanitizes HTML input', () => {
      const input = '<script>alert("xss")</script>Hello World'
      const result = sanitizeHtml(input)
      expect(result).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;Hello World')
    })

    it('handles empty string', () => {
      const result = sanitizeHtml('')
      expect(result).toBe('')
    })

    it('handles plain text', () => {
      const result = sanitizeHtml('Plain text without HTML')
      expect(result).toBe('Plain text without HTML')
    })

    it('handles special characters', () => {
      const result = sanitizeHtml('<>&"\'')
      expect(result).toBe('&lt;&gt;&amp;"\'')
    })
  })
}) 