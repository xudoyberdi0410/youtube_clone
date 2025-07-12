import { mapApiVideoToVideo } from '@/lib/utils/video-mapper'
import type { Video as ApiVideo } from '@/types/api'
import type { Video } from '@/types/video'

describe('video-mapper', () => {
  const mockApiVideo: ApiVideo = {
    id: 1,
    channel_name: 'testuser',
    profile_image: 'avatar.jpg',
    video_title: 'Test Video',
    video_description: 'Test Description',
    file_path: 'videos/test-video.mp4',
    thumbnail_path: 'thumbnails/test-thumb.jpg',
    category: 'Musiqa',
    video_views: 1500,
    created_at: '2024-01-01T00:00:00Z',
    like_amount: 150,
    dislike_amount: 15,
    duration_video: '02:30',
  }

  it('should map API video to Video correctly', () => {
    const result = mapApiVideoToVideo(mockApiVideo)

    expect(result.id).toBe('1')
    expect(result.title).toBe('Test Video')
    expect(result.description).toBe('Test Description')
    expect(result.videoUrl).toBe('https://youtube-jfmi.onrender.com/videos/test-video.mp4')
    expect(result.views).toBe(1500)
    expect(result.likes).toBe(150)
    expect(result.dislikes).toBe(15)
    expect(result.channel.name).toBe('testuser')
    expect(result.channel.avatarUrl).toBe('https://youtube-jfmi.onrender.com/images/avatar.jpg')
    expect(result.channel.id).toBe('channel-1')
  })

  it('should handle missing video_views, like_amount, dislike_amount', () => {
    const apiVideoWithoutNewFields: ApiVideo = {
      ...mockApiVideo,
      video_views: undefined,
      like_amount: undefined,
      dislike_amount: undefined,
    }

    const result = mapApiVideoToVideo(apiVideoWithoutNewFields)

    expect(result.views).toBe(0) // Should fall back to 0
    expect(result.likes).toBe(0) // Should fall back to 0
    expect(result.dislikes).toBe(0) // Should fall back to 0
  })

  it('should handle missing profile_image', () => {
    const apiVideoWithoutProfileImage: ApiVideo = {
      ...mockApiVideo,
      profile_image: null,
    }

    const result = mapApiVideoToVideo(apiVideoWithoutProfileImage)

    expect(result.channel.avatarUrl).toBeUndefined()
  })

  it('should handle missing thumbnail_path', () => {
    const apiVideoWithoutThumbnail: ApiVideo = {
      ...mockApiVideo,
      thumbnail_path: null,
    }

    const result = mapApiVideoToVideo(apiVideoWithoutThumbnail)

    expect(result.preview).toBe('/previews/previews1.png')
  })

  it('should handle missing video_description', () => {
    const apiVideoWithoutDescription: ApiVideo = {
      ...mockApiVideo,
      video_description: undefined,
    }

    const result = mapApiVideoToVideo(apiVideoWithoutDescription)

    expect(result.description).toBe('')
  })

  it('should handle zero values', () => {
    const apiVideoWithZeros: ApiVideo = {
      ...mockApiVideo,
      video_views: 0,
      like_amount: 0,
      dislike_amount: 0,
    }

    const result = mapApiVideoToVideo(apiVideoWithZeros)

    expect(result.views).toBe(0)
    expect(result.likes).toBe(0)
    expect(result.dislikes).toBe(0)
  })

  it('should handle large numbers', () => {
    const apiVideoWithLargeNumbers: ApiVideo = {
      ...mockApiVideo,
      video_views: 999999,
      like_amount: 99999,
      dislike_amount: 9999,
    }

    const result = mapApiVideoToVideo(apiVideoWithLargeNumbers)

    expect(result.views).toBe(999999)
    expect(result.likes).toBe(99999)
    expect(result.dislikes).toBe(9999)
  })

  it('should handle special characters in title and description', () => {
    const apiVideoWithSpecialChars: ApiVideo = {
      ...mockApiVideo,
      video_title: 'Test Video with "quotes" & <tags>',
      video_description: 'Description with \n newlines and \t tabs',
    }

    const result = mapApiVideoToVideo(apiVideoWithSpecialChars)

    expect(result.title).toBe('Test Video with "quotes" & <tags>')
    expect(result.description).toBe('Description with \n newlines and \t tabs')
  })

  it('should handle empty strings', () => {
    const apiVideoWithEmptyStrings: ApiVideo = {
      ...mockApiVideo,
      video_title: '',
      video_description: '',
      channel_name: '',
      profile_image: '',
    }

    const result = mapApiVideoToVideo(apiVideoWithEmptyStrings)

    expect(result.title).toBe('Untitled')
    expect(result.description).toBe('')
    expect(result.channel.name).toBe('Unknown Channel')
    expect(result.channel.avatarUrl).toBeUndefined()
  })

  it('should handle null values', () => {
    const apiVideoWithNulls: ApiVideo = {
      ...mockApiVideo,
      video_title: null as any,
      video_description: null as any,
      channel_name: null as any,
      profile_image: null,
    }

    const result = mapApiVideoToVideo(apiVideoWithNulls)

    expect(result.title).toBe('Untitled')
    expect(result.description).toBe('')
    expect(result.channel.name).toBe('Unknown Channel')
    expect(result.channel.avatarUrl).toBeUndefined()
  })

  it('should handle different date formats', () => {
    const apiVideoWithDifferentDate: ApiVideo = {
      ...mockApiVideo,
      created_at: '2024-12-31T23:59:59.999Z',
    }

    const result = mapApiVideoToVideo(apiVideoWithDifferentDate)

    expect(result.uploadedAt).toBeDefined()
  })

  it('should handle very long strings', () => {
    const longString = 'a'.repeat(1000)
    const apiVideoWithLongStrings: ApiVideo = {
      ...mockApiVideo,
      video_title: longString,
      video_description: longString,
      channel_name: longString,
    }

    const result = mapApiVideoToVideo(apiVideoWithLongStrings)

    expect(result.title).toBe(longString)
    expect(result.description).toBe(longString)
    expect(result.channel.name).toBe(longString)
  })

  it('should handle different URL formats', () => {
    const apiVideoWithDifferentUrls: ApiVideo = {
      ...mockApiVideo,
      file_path: 'videos\\test-video.mp4',
      thumbnail_path: 'thumbnails\\test-thumb.jpg',
      profile_image: 'avatars\\user-avatar.png',
    }

    const result = mapApiVideoToVideo(apiVideoWithDifferentUrls)

    expect(result.videoUrl).toBe('https://youtube-jfmi.onrender.com/videos/test-video.mp4')
    expect(result.preview).toBe('https://youtube-jfmi.onrender.com/thumbnails/test-thumb.jpg')
    expect(result.channel.avatarUrl).toBe('https://youtube-jfmi.onrender.com/images/avatars/user-avatar.png')
  })

  it('should handle array of videos', () => {
    const apiVideos: ApiVideo[] = [
      mockApiVideo,
      {
        ...mockApiVideo,
        id: 2,
        channel_name: 'testuser2',
        video_title: 'Test Video 2',
      },
    ]

    const results = apiVideos.map(mapApiVideoToVideo)

    expect(results).toHaveLength(2)
    expect(results[0].id).toBe('1')
    expect(results[0].title).toBe('Test Video')
    expect(results[0].channel.name).toBe('testuser')
    expect(results[1].id).toBe('2')
    expect(results[1].title).toBe('Test Video 2')
    expect(results[1].channel.name).toBe('testuser2')
  })
}) 