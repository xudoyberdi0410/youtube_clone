import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LikedVideosPage from '@/app/feed/liked-videos/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useLikedVideos hook
jest.mock('@/hooks/use-liked-videos', () => ({
  __esModule: true,
  useLikedVideos: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

describe('Feed Liked Videos Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockLikedVideos = [
    {
      id: 1,
      user_id: 1,
      video_id: 1,
      is_like: true,
      created_at: '2023-01-01T00:00:00.000Z',
      video: {
        id: 1,
        video_title: 'Test Video 1',
        description: 'Test description 1',
        thumbnail_path: 'thumbnail-1.jpg',
        duration: 120,
        video_views: 1000,
        likeCount: 100,
        created_at: '2023-01-01T00:00:00.000Z',
        channel_name: 'Test Channel 1',
        name: 'Test Channel 1',
      },
    },
    {
      id: 2,
      user_id: 1,
      video_id: 2,
      is_like: true,
      created_at: '2023-01-02T00:00:00.000Z',
      video: {
        id: 2,
        video_title: 'Test Video 2',
        description: 'Test description 2',
        thumbnail_path: 'thumbnail-2.jpg',
        duration: 180,
        video_views: 2000,
        likeCount: 200,
        created_at: '2023-01-02T00:00:00.000Z',
        channel_name: 'Test Channel 2',
        name: 'Test Channel 2',
      },
    },
  ];

  beforeEach(async () => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock useAuth hook
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: true,
      user: { id: 'user-1', name: 'Test User' },
      loading: false,
    });

    // Mock useLikedVideos hook
    const { useLikedVideos } = await import('@/hooks/use-liked-videos');
    useLikedVideos.mockReturnValue({
      likedVideos: mockLikedVideos,
      isLoading: false,
      error: null,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders liked videos page with title', async () => {
    render(<LikedVideosPage />);

    await waitFor(() => {
      expect(screen.getByText('Liked videos')).toBeInTheDocument();
    });
  });

  it('renders liked videos', async () => {
    render(<LikedVideosPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Video 1')).toBeInTheDocument();
      expect(screen.getByText('Test Video 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Channel 1')).toBeInTheDocument();
    expect(screen.getByText('Test Channel 2')).toBeInTheDocument();
  });

  it('shows video statistics correctly', async () => {
    render(<LikedVideosPage />);

    await waitFor(() => {
      expect(screen.getByText('1000 просмотров')).toBeInTheDocument();
      expect(screen.getByText('2000 просмотров')).toBeInTheDocument();
    });
  });

  it('shows video duration correctly', async () => {
    render(<LikedVideosPage />);

    await waitFor(() => {
      expect(screen.getByText('2:00')).toBeInTheDocument();
      expect(screen.getByText('3:00')).toBeInTheDocument();
    });
  });

  it('shows video publish date correctly', async () => {
    render(<LikedVideosPage />);

    await waitFor(() => {
      // Проверяем, что отображается дата публикации (используем getAllByText для множественных элементов)
      expect(screen.getAllByText(/2023/)).toHaveLength(2);
    });
  });

  it('shows loading state when liked videos are loading', async () => {
    const { useLikedVideos } = await import('@/hooks/use-liked-videos');
    useLikedVideos.mockReturnValue({
      likedVideos: [],
      isLoading: true,
      error: null,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
    });

    render(<LikedVideosPage />);

    // Проверяем наличие skeleton loader
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows error state when liked videos fail to load', async () => {
    const { useLikedVideos } = await import('@/hooks/use-liked-videos');
    useLikedVideos.mockReturnValue({
      likedVideos: [],
      isLoading: false,
      error: 'Failed to load liked videos',
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
    });

    render(<LikedVideosPage />);

    expect(screen.getByText('Error loading')).toBeInTheDocument();
  });

  it('shows empty state when no liked videos found', async () => {
    const { useLikedVideos } = await import('@/hooks/use-liked-videos');
    useLikedVideos.mockReturnValue({
      likedVideos: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<LikedVideosPage />);
    expect(screen.getByText('You have no liked videos yet')).toBeInTheDocument();
  });

  it('requires authentication to access liked videos', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: false,
      user: null,
      loading: false,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<LikedVideosPage />);
    // AuthRequiredDialog should be rendered when not logged in
    expect(screen.getByText('Sign in to view liked videos')).toBeInTheDocument();
  });

  it('should show loading indicator when fetching next page', async () => {
    const { useLikedVideos } = await import('@/hooks/use-liked-videos');
    useLikedVideos.mockReturnValue({
      likedVideos: [],
      isLoading: true,
      error: null,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: true,
    });

    render(<LikedVideosPage />);
    // Проверяем, что не отображается пустой стейт
    expect(screen.queryByText('You have no liked videos yet')).not.toBeInTheDocument();
  });
}); 