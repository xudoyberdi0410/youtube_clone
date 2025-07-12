import { renderHook, waitFor } from '@testing-library/react';
import { useShorts } from '../useShorts';
import { apiClient } from '@/lib/api-client';
import { ShortVideo } from '../../types';

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    getShorts: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

// Mock data
const mockApiShorts = [
  {
    id: 1,
    title: 'Test Short 1',
    description: 'Test description 1',
    video_url: 'https://example.com/video1.mp4',
    thumbnail_url: 'https://example.com/thumb1.jpg',
    views_count: 1000,
    likes_count: 100,
    dislikes_count: 10,
    created_at: '2023-01-01T00:00:00Z',
    channel: {
      id: 1,
      channel_name: 'Test Channel',
      profile_image_url: 'https://example.com/avatar.jpg',
      subscribers_count: 5000,
    },
  },
  {
    id: 2,
    title: 'Test Short 2',
    description: 'Test description 2',
    video_url: 'https://example.com/video2.mp4',
    thumbnail_url: 'https://example.com/thumb2.jpg',
    views_count: 2000,
    likes_count: 200,
    dislikes_count: 20,
    created_at: '2023-01-02T00:00:00Z',
    channel: null,
  },
];

const expectedTransformedShorts: ShortVideo[] = [
  {
    id: '1',
    title: 'Test Short 1',
    description: 'Test description 1',
    video_url: 'https://example.com/video1.mp4',
    thumbnail_url: 'https://example.com/thumb1.jpg',
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
  },
  {
    id: '2',
    title: 'Test Short 2',
    description: 'Test description 2',
    video_url: 'https://example.com/video2.mp4',
    thumbnail_url: 'https://example.com/thumb2.jpg',
    views_count: 2000,
    likes_count: 200,
    dislikes_count: 20,
    created_at: '2023-01-02T00:00:00Z',
    channel: undefined,
  },
];

describe('useShorts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with loading state', () => {
    mockApiClient.getShorts.mockResolvedValue([]);
    
    const { result } = renderHook(() => useShorts());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.shorts).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should fetch and transform shorts successfully', async () => {
    mockApiClient.getShorts.mockResolvedValue(mockApiShorts);
    
    const { result } = renderHook(() => useShorts());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.shorts).toEqual(expectedTransformedShorts);
    expect(result.current.error).toBe(null);
    expect(mockApiClient.getShorts).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'Network error';
    mockApiClient.getShorts.mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useShorts());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.shorts).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching shorts:',
      errorMessage,
      expect.any(Error)
    );
  });

  it('should handle string errors', async () => {
    const errorMessage = 'String error';
    mockApiClient.getShorts.mockRejectedValue(errorMessage);
    
    const { result } = renderHook(() => useShorts());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle object errors with message property', async () => {
    const errorObj = { message: 'Object error message' };
    mockApiClient.getShorts.mockRejectedValue(errorObj);
    
    const { result } = renderHook(() => useShorts());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBe('Object error message');
  });

  it('should handle object errors with detail property', async () => {
    const errorObj = { detail: 'Detail error message' };
    mockApiClient.getShorts.mockRejectedValue(errorObj);
    
    const { result } = renderHook(() => useShorts());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBe('Detail error message');
  });

  it('should handle object errors with status property', async () => {
    const errorObj = { status: 404 };
    mockApiClient.getShorts.mockRejectedValue(errorObj);
    
    const { result } = renderHook(() => useShorts());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBe('HTTP 404');
  });

  it('should handle unknown error types', async () => {
    const unknownError = null;
    mockApiClient.getShorts.mockRejectedValue(unknownError);
    
    const { result } = renderHook(() => useShorts());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBe('Unknown error occurred');
  });

  it('should refresh shorts when refreshShorts is called', async () => {
    mockApiClient.getShorts.mockResolvedValue(mockApiShorts);
    
    const { result } = renderHook(() => useShorts());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Mock new data for refresh
    const newMockShorts = [{ ...mockApiShorts[0], id: 3, title: 'New Short' }];
    mockApiClient.getShorts.mockResolvedValue(newMockShorts);
    
    result.current.refreshShorts();
    
    await waitFor(() => {
      expect(mockApiClient.getShorts).toHaveBeenCalledTimes(2);
    });
    
    await waitFor(() => {
      expect(result.current.shorts[0].id).toBe('3');
      expect(result.current.shorts[0].title).toBe('New Short');
    });
  });

  it('should transform shorts correctly with null channel', () => {
    const shortsWithNullChannel = [
      {
        ...mockApiShorts[0],
        channel: null,
      },
    ];
    
    mockApiClient.getShorts.mockResolvedValue(shortsWithNullChannel);
    
    const { result } = renderHook(() => useShorts());
    
    return waitFor(() => {
      expect(result.current.shorts[0].channel).toBeUndefined();
    });
  });

  it('should handle empty shorts array', async () => {
    mockApiClient.getShorts.mockResolvedValue([]);
    
    const { result } = renderHook(() => useShorts());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.shorts).toEqual([]);
    expect(result.current.error).toBe(null);
  });
}); 