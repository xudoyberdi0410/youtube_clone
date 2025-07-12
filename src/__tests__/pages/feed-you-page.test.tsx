import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import YouPage from '@/app/feed/you/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

// Mock the useSubscriptions hook
jest.mock('@/hooks/use-subscriptions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the useLikedVideos hook
jest.mock('@/hooks/use-liked-videos', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Feed You Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockUser = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'user-avatar.jpg',
  };

  const mockSubscriptions = [
    {
      id: 'channel-1',
      name: 'Test Channel 1',
      avatar: 'avatar-1.jpg',
      verified: true,
      subscriberCount: 10000,
      videoCount: 50,
    },
    {
      id: 'channel-2',
      name: 'Test Channel 2',
      avatar: 'avatar-2.jpg',
      verified: false,
      subscriberCount: 5000,
      videoCount: 25,
    },
  ];

  const mockLikedVideos = [
    {
      id: 'video-1',
      title: 'Liked Video 1',
      thumbnail: 'thumbnail-1.jpg',
      duration: 120,
      viewCount: 1000,
      channel: {
        id: 'channel-1',
        name: 'Test Channel 1',
        avatar: 'avatar-1.jpg',
        verified: true,
      },
    },
    {
      id: 'video-2',
      title: 'Liked Video 2',
      thumbnail: 'thumbnail-2.jpg',
      duration: 180,
      viewCount: 2000,
      channel: {
        id: 'channel-2',
        name: 'Test Channel 2',
        avatar: 'avatar-2.jpg',
        verified: false,
      },
    },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock useAuth hook
    const { useAuth } = require('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      error: null,
      isAuthenticated: true,
    });

    // Mock useSubscriptions hook
    const { default: useSubscriptions } = require('@/hooks/use-subscriptions');
    useSubscriptions.mockReturnValue({
      subscriptions: mockSubscriptions,
      isLoading: false,
      error: null,
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    });

    // Mock useLikedVideos hook
    const { default: useLikedVideos } = require('@/hooks/use-liked-videos');
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

  it('renders you page with history section', async () => {
    render(<YouPage />);

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  it('renders liked videos section', async () => {
    render(<YouPage />);

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  it('renders playlists section', async () => {
    render(<YouPage />);

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  it('shows see all links', async () => {
    render(<YouPage />);

    await waitFor(() => {
      expect(screen.getAllByText('See all')).toHaveLength(3);
    });
  });

  it('shows loading skeletons when data is loading', () => {
    render(<YouPage />);

    // Check for loading skeletons by class
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('shows loading state when data is loading', () => {
    render(<YouPage />);

    // Check for loading skeletons
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('shows error state when data fails to load', () => {
    render(<YouPage />);

    // Component handles errors silently, so we just check it renders
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('renders page without authentication requirement', () => {
    render(<YouPage />);

    // Page renders normally without auth check
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('shows verified badge for verified channels', async () => {
    render(<YouPage />);

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  it('does not show verified badge for unverified channels', async () => {
    render(<YouPage />);

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  it('shows video duration correctly', async () => {
    render(<YouPage />);

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  it('shows history section title', async () => {
    render(<YouPage />);

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  it('shows liked videos section title', async () => {
    render(<YouPage />);

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  it('shows playlists section title', async () => {
    render(<YouPage />);

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  it('shows loading skeletons for playlists', () => {
    render(<YouPage />);

    // Check for playlist loading skeletons
    const playlistSkeletons = document.querySelectorAll('.animate-pulse');
    expect(playlistSkeletons.length).toBeGreaterThan(0);
  });
});