import {
  formatViews,
  formatDuration,
  formatFileSize,
  formatRelativeTime,
  truncateText,
  formatSubscriberCount,
} from '@/lib/utils/format'

describe('Format Utils', () => {
  describe('formatViews', () => {
    test('formats views less than 1000', () => {
      expect(formatViews(999)).toBe('999')
      expect(formatViews(500)).toBe('500')
      expect(formatViews(0)).toBe('0')
    })

    test('formats views in thousands', () => {
      expect(formatViews(1000)).toBe('1.0K')
      expect(formatViews(1500)).toBe('1.5K')
      expect(formatViews(999999)).toBe('1000.0K')
    })

    test('formats views in millions', () => {
      expect(formatViews(1000000)).toBe('1.0M')
      expect(formatViews(2500000)).toBe('2.5M')
      expect(formatViews(999999999)).toBe('1000.0M')
    })

    test('formats views in billions', () => {
      expect(formatViews(1000000000)).toBe('1.0B')
      expect(formatViews(2500000000)).toBe('2.5B')
    })
  })

  describe('formatDuration', () => {
    test('formats duration less than 1 hour', () => {
      expect(formatDuration(30)).toBe('0:30')
      expect(formatDuration(90)).toBe('1:30')
      expect(formatDuration(600)).toBe('10:00')
      expect(formatDuration(3599)).toBe('59:59')
    })

    test('formats duration with hours', () => {
      expect(formatDuration(3600)).toBe('1:00:00')
      expect(formatDuration(3661)).toBe('1:01:01')
      expect(formatDuration(7200)).toBe('2:00:00')
      expect(formatDuration(3723)).toBe('1:02:03')
    })
  })

  describe('formatFileSize', () => {
    test('formats zero bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
    })

    test('formats bytes', () => {
      expect(formatFileSize(500)).toBe('500 Bytes')
      expect(formatFileSize(1023)).toBe('1023 Bytes')
    })

    test('formats kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })

    test('formats megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(2621440)).toBe('2.5 MB')
    })

    test('formats gigabytes', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB')
      expect(formatFileSize(2684354560)).toBe('2.5 GB')
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock current time to ensure consistent test results
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    test('formats "just now" for very recent dates', () => {
      const now = new Date('2024-01-15T12:00:00Z')
      expect(formatRelativeTime(now)).toBe('Just now')
    })

    test('formats minutes ago', () => {
      const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z')
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago')
      
      const oneMinuteAgo = new Date('2024-01-15T11:59:00Z')
      expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago')
    })

    test('formats hours ago', () => {
      const twoHoursAgo = new Date('2024-01-15T10:00:00Z')
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago')
      
      const oneHourAgo = new Date('2024-01-15T11:00:00Z')
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago')
    })

    test('formats days ago', () => {
      const twoDaysAgo = new Date('2024-01-13T12:00:00Z')
      expect(formatRelativeTime(twoDaysAgo)).toBe('2 days ago')
      
      const oneDayAgo = new Date('2024-01-14T12:00:00Z')
      expect(formatRelativeTime(oneDayAgo)).toBe('1 day ago')
    })
  })

  describe('truncateText', () => {
    test('returns original text if shorter than max length', () => {
      expect(truncateText('Short text', 20)).toBe('Short text')
    })

    test('truncates text with ellipsis if longer than max length', () => {
      expect(truncateText('This is a very long text', 10)).toBe('This is a ...')
    })

    test('handles exact length', () => {
      expect(truncateText('Exact', 5)).toBe('Exact')
    })
  })

  describe('formatSubscriberCount', () => {
    test('formats singular subscriber', () => {
      expect(formatSubscriberCount(1)).toBe('1 subscriber')
    })

    test('formats plural subscribers', () => {
      expect(formatSubscriberCount(2)).toBe('2 subscribers')
      expect(formatSubscriberCount(1000)).toBe('1.0K subscribers')
      expect(formatSubscriberCount(1500000)).toBe('1.5M subscribers')
    })
  })
})
