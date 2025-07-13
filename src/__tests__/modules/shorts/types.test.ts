import { ShortVideo, ShortsApiResponse } from '@/modules/shorts/types';

describe('Shorts Types', () => {
  describe('ShortVideo interface', () => {
    it('should have all required properties', () => {
      const shortVideo: ShortVideo = {
        id: '1',
        title: 'Test Video',
        description: 'Test Description',
        video_url: 'https://example.com/video.mp4',
        thumbnail_url: 'https://example.com/thumb.jpg',
        views_count: 1000,
        likes_count: 100,
        dislikes_count: 10,
        created_at: '2023-01-01T00:00:00Z',
        channel: {
          id: '1',
          channel_name: 'Test Channel',
          profile_image_url: 'https://example.com/avatar.jpg',
          subscribers_count: 5000,
        },
      };

      expect(shortVideo.id).toBe('1');
      expect(shortVideo.title).toBe('Test Video');
      expect(shortVideo.description).toBe('Test Description');
      expect(shortVideo.video_url).toBe('https://example.com/video.mp4');
      expect(shortVideo.thumbnail_url).toBe('https://example.com/thumb.jpg');
      expect(shortVideo.views_count).toBe(1000);
      expect(shortVideo.likes_count).toBe(100);
      expect(shortVideo.dislikes_count).toBe(10);
      expect(shortVideo.created_at).toBe('2023-01-01T00:00:00Z');
      expect(shortVideo.channel).toBeDefined();
      expect(shortVideo.channel!.id).toBe('1');
      expect(shortVideo.channel!.channel_name).toBe('Test Channel');
      expect(shortVideo.channel!.profile_image_url).toBe('https://example.com/avatar.jpg');
      expect(shortVideo.channel!.subscribers_count).toBe(5000);
    });

    it('should allow optional thumbnail_url', () => {
      const shortVideo: ShortVideo = {
        id: '1',
        title: 'Test Video',
        description: 'Test Description',
        video_url: 'https://example.com/video.mp4',
        views_count: 1000,
        likes_count: 100,
        dislikes_count: 10,
        created_at: '2023-01-01T00:00:00Z',
        channel: {
          id: '1',
          channel_name: 'Test Channel',
          profile_image_url: 'https://example.com/avatar.jpg',
          subscribers_count: 5000,
        },
      };

      expect(shortVideo.thumbnail_url).toBeUndefined();
    });

    it('should allow optional channel', () => {
      const shortVideo: ShortVideo = {
        id: '1',
        title: 'Test Video',
        description: 'Test Description',
        video_url: 'https://example.com/video.mp4',
        views_count: 1000,
        likes_count: 100,
        dislikes_count: 10,
        created_at: '2023-01-01T00:00:00Z',
      };

      expect(shortVideo.channel).toBeUndefined();
    });

    it('should allow optional channel properties', () => {
      const shortVideo: ShortVideo = {
        id: '1',
        title: 'Test Video',
        description: 'Test Description',
        video_url: 'https://example.com/video.mp4',
        views_count: 1000,
        likes_count: 100,
        dislikes_count: 10,
        created_at: '2023-01-01T00:00:00Z',
        channel: {
          id: '1',
          channel_name: 'Test Channel',
        },
      };

      expect(shortVideo.channel!.profile_image_url).toBeUndefined();
      expect(shortVideo.channel!.subscribers_count).toBeUndefined();
    });

    it('should handle numeric string IDs correctly', () => {
      const shortVideo: ShortVideo = {
        id: '123',
        title: 'Test Video',
        description: 'Test Description',
        video_url: 'https://example.com/video.mp4',
        views_count: 1000,
        likes_count: 100,
        dislikes_count: 10,
        created_at: '2023-01-01T00:00:00Z',
        channel: {
          id: '456',
          channel_name: 'Test Channel',
        },
      };

      expect(typeof shortVideo.id).toBe('string');
      expect(typeof shortVideo.channel!.id).toBe('string');
      expect(shortVideo.id).toBe('123');
      expect(shortVideo.channel!.id).toBe('456');
    });

    it('should handle large numbers correctly', () => {
      const shortVideo: ShortVideo = {
        id: '1',
        title: 'Test Video',
        description: 'Test Description',
        video_url: 'https://example.com/video.mp4',
        views_count: 1000000,
        likes_count: 50000,
        dislikes_count: 1000,
        created_at: '2023-01-01T00:00:00Z',
        channel: {
          id: '1',
          channel_name: 'Test Channel',
          subscribers_count: 1000000,
        },
      };

      expect(shortVideo.views_count).toBe(1000000);
      expect(shortVideo.likes_count).toBe(50000);
      expect(shortVideo.dislikes_count).toBe(1000);
      expect(shortVideo.channel!.subscribers_count).toBe(1000000);
    });
  });

  describe('ShortsApiResponse interface', () => {
    it('should have all required properties', () => {
      const apiResponse: ShortsApiResponse = {
        shorts: [
          {
            id: '1',
            title: 'Test Video',
            description: 'Test Description',
            video_url: 'https://example.com/video.mp4',
            views_count: 1000,
            likes_count: 100,
            dislikes_count: 10,
            created_at: '2023-01-01T00:00:00Z',
          },
        ],
        loading: false,
        error: null,
      };

      expect(Array.isArray(apiResponse.shorts)).toBe(true);
      expect(apiResponse.shorts).toHaveLength(1);
      expect(typeof apiResponse.loading).toBe('boolean');
      expect(apiResponse.error).toBe(null);
    });

    it('should handle loading state', () => {
      const apiResponse: ShortsApiResponse = {
        shorts: [],
        loading: true,
        error: null,
      };

      expect(apiResponse.loading).toBe(true);
      expect(apiResponse.shorts).toHaveLength(0);
      expect(apiResponse.error).toBe(null);
    });

    it('should handle error state', () => {
      const apiResponse: ShortsApiResponse = {
        shorts: [],
        loading: false,
        error: 'Network error',
      };

      expect(apiResponse.loading).toBe(false);
      expect(apiResponse.shorts).toHaveLength(0);
      expect(apiResponse.error).toBe('Network error');
    });

    it('should handle empty shorts array', () => {
      const apiResponse: ShortsApiResponse = {
        shorts: [],
        loading: false,
        error: null,
      };

      expect(apiResponse.shorts).toHaveLength(0);
      expect(apiResponse.loading).toBe(false);
      expect(apiResponse.error).toBe(null);
    });

    it('should handle multiple shorts', () => {
      const apiResponse: ShortsApiResponse = {
        shorts: [
          {
            id: '1',
            title: 'Test Video 1',
            description: 'Test Description 1',
            video_url: 'https://example.com/video1.mp4',
            views_count: 1000,
            likes_count: 100,
            dislikes_count: 10,
            created_at: '2023-01-01T00:00:00Z',
          },
          {
            id: '2',
            title: 'Test Video 2',
            description: 'Test Description 2',
            video_url: 'https://example.com/video2.mp4',
            views_count: 2000,
            likes_count: 200,
            dislikes_count: 20,
            created_at: '2023-01-02T00:00:00Z',
          },
        ],
        loading: false,
        error: null,
      };

      expect(apiResponse.shorts).toHaveLength(2);
      expect(apiResponse.shorts[0].id).toBe('1');
      expect(apiResponse.shorts[1].id).toBe('2');
    });
  });

  describe('Type compatibility', () => {
    it('should be compatible with API response structure', () => {
      // This test ensures that the types are compatible with the expected API structure
      const mockApiResponse = {
        shorts: [
          {
            id: 1, // API returns number
            title: 'Test Video',
            description: 'Test Description',
            video_url: 'https://example.com/video.mp4',
            thumbnail_url: 'https://example.com/thumb.jpg',
            views_count: 1000,
            likes_count: 100,
            dislikes_count: 10,
            created_at: '2023-01-01T00:00:00Z',
            channel: {
              id: 1, // API returns number
              channel_name: 'Test Channel',
              profile_image_url: 'https://example.com/avatar.jpg',
              subscribers_count: 5000,
            },
          },
        ],
      };

      // Transform API response to component format
      const transformedShorts: ShortVideo[] = mockApiResponse.shorts.map((short) => ({
        id: short.id.toString(),
        title: short.title,
        description: short.description,
        video_url: short.video_url,
        thumbnail_url: short.thumbnail_url,
        views_count: short.views_count,
        likes_count: short.likes_count,
        dislikes_count: short.dislikes_count,
        created_at: short.created_at,
        channel: short.channel
          ? {
              id: short.channel.id.toString(),
              channel_name: short.channel.channel_name,
              profile_image_url: short.channel.profile_image_url,
              subscribers_count: short.channel.subscribers_count,
            }
          : undefined,
      }));

      expect(transformedShorts).toHaveLength(1);
      expect(transformedShorts[0].id).toBe('1');
      expect(transformedShorts[0].channel!.id).toBe('1');
      expect(typeof transformedShorts[0].id).toBe('string');
      expect(typeof transformedShorts[0].channel!.id).toBe('string');
    });

    it('should handle null channel from API', () => {
      const mockApiResponse = {
        shorts: [
          {
            id: 1,
            title: 'Test Video',
            description: 'Test Description',
            video_url: 'https://example.com/video.mp4',
            views_count: 1000,
            likes_count: 100,
            dislikes_count: 10,
            created_at: '2023-01-01T00:00:00Z',
            channel: null, // API can return null
          },
        ],
      };

      const transformedShorts: ShortVideo[] = mockApiResponse.shorts.map((short) => ({
        id: short.id.toString(),
        title: short.title,
        description: short.description,
        video_url: short.video_url,
        views_count: short.views_count,
        likes_count: short.likes_count,
        dislikes_count: short.dislikes_count,
        created_at: short.created_at,
        channel: short.channel
          ? {
              id: short.channel.id.toString(),
              channel_name: short.channel.channel_name,
              profile_image_url: short.channel.profile_image_url,
              subscribers_count: short.channel.subscribers_count,
            }
          : undefined,
      }));

      expect(transformedShorts[0].channel).toBeUndefined();
    });
  });
}); 