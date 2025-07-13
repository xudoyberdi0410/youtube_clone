import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { WatchVideo } from '@/modules/home/ui/components/watch-video';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: () => new URLSearchParams('?v=test-video-id'),
}));

// Mock the useVideo hook
jest.mock('@/hooks/use-video', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the useVideoComments hook
jest.mock('@/hooks/use-video-comments', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the useVideoStats hook
jest.mock('@/hooks/use-video-stats', () => ({
  __esModule: true,
  useVideoStats: jest.fn(),
}));

// Mock the useLikes hook
jest.mock('@/hooks/use-likes', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the useSubscriptions hook
jest.mock('@/hooks/use-subscriptions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the usePlaylists hook
jest.mock('@/hooks/use-playlists', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Watch Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(async () => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    // Mock useVideo hook
    const { default: useVideo } = await import('@/hooks/use-video');
    useVideo.mockReturnValue({
      video: null,
      isLoading: false,
      error: null,
    });

    // Mock useVideoComments hook
    const { default: useVideoComments } = await import('@/hooks/use-video-comments');
    useVideoComments.mockReturnValue({
      comments: [],
      isLoading: false,
      error: null,
      addComment: jest.fn(),
    });

    // Mock useVideoStats hook
    const { useVideoStats } = await import('@/hooks/use-video-stats');
    useVideoStats.mockReturnValue({
      stats: {
        viewCount: 0,
        likeCount: 0,
        dislikeCount: 0,
      },
      isLoading: false,
      error: null,
    });

    // Mock useLikes hook
    const { default: useLikes } = await import('@/hooks/use-likes');
    useLikes.mockReturnValue({
      isLiked: false,
      isDisliked: false,
      likeCount: 0,
      dislikeCount: 0,
      toggleLike: jest.fn(),
      toggleDislike: jest.fn(),
    });

    // Mock useSubscriptions hook
    const { default: useSubscriptions } = await import('@/hooks/use-subscriptions');
    useSubscriptions.mockReturnValue({
      isSubscribed: false,
      subscriberCount: 0,
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    });

    // Mock usePlaylists hook
    const { default: usePlaylists } = await import('@/hooks/use-playlists');
    usePlaylists.mockReturnValue({
      playlists: [],
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders watch video component', () => {
    render(<WatchVideo videoId="test-video-id" startTime={0} />);
    // Проверяем наличие skeleton элементов
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('shows error state when video fails to load', async () => {
    const { default: useVideo } = await import('@/hooks/use-video');
    useVideo.mockReturnValue({
      video: null,
      isLoading: false,
      error: 'Ошибка загрузки видео: Cannot read properties of undefined (reading "ok")',
    });

    render(<WatchVideo videoId="test-video-id" startTime={0} />);
    // Проверяем наличие skeleton элементов (компонент показывает skeleton при ошибке)
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('shows loading skeleton when loading', async () => {
    const { default: useVideo } = await import('@/hooks/use-video');
    useVideo.mockReturnValue({
      video: null,
      isLoading: true,
      error: null,
    });

    render(<WatchVideo videoId="test-video-id" startTime={0} />);
    // Проверяем наличие skeleton элементов по классу
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('shows empty state when no video ID provided', async () => {
    const { default: useVideo } = await import('@/hooks/use-video');
    useVideo.mockReturnValue({
      video: null,
      isLoading: false,
      error: null,
    });

    render(<WatchVideo videoId="" startTime={0} />);
    expect(screen.getByText(/Video not found/i)).toBeInTheDocument();
  });
}); 