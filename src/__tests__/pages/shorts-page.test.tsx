import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ShortsPage from '@/app/shorts/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useShorts hook
jest.mock('@/modules/shorts/hooks/useShorts', () => ({
  __esModule: true,
  useShorts: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

describe('Shorts Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockShorts = [
    {
      id: '1',
      title: 'Amazing Short 1',
      description: 'This is an amazing short video',
      video_url: 'video-1.mp4',
      thumbnail_url: 'thumbnail-1.jpg',
      views_count: 10000,
      likes_count: 500,
      created_at: '2023-12-01T00:00:00.000Z',
      channel: {
        id: '1',
        channel_name: 'Short Channel 1',
        profile_image_url: 'avatar-1.jpg',
        subscribers_count: 1000,
      },
    },
    {
      id: '2',
      title: 'Amazing Short 2',
      description: 'Another amazing short video',
      video_url: 'video-2.mp4',
      thumbnail_url: 'thumbnail-2.jpg',
      views_count: 15000,
      likes_count: 750,
      created_at: '2023-12-02T00:00:00.000Z',
      channel: {
        id: '2',
        channel_name: 'Short Channel 2',
        profile_image_url: 'avatar-2.jpg',
        subscribers_count: 500,
      },
    },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock useAuth hook
    const { useAuth } = require('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: true,
      user: { id: 'user-1', name: 'Test User' },
      loading: false,
    });

    // Mock useShorts hook
    const { useShorts } = require('@/modules/shorts/hooks/useShorts');
    useShorts.mockReturnValue({
      shorts: mockShorts,
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders shorts videos', async () => {
    render(<ShortsPage />);

    await waitFor(() => {
      expect(screen.getByText('Amazing Short 1')).toBeInTheDocument();
      expect(screen.getByText('Amazing Short 2')).toBeInTheDocument();
    });
  });

  it('shows video statistics correctly', async () => {
    render(<ShortsPage />);

    await waitFor(() => {
      expect(screen.getByText(/10,000/)).toBeInTheDocument();
      expect(screen.getByText(/15,000/)).toBeInTheDocument();
    });

    // Проверяем лайки, используя более специфичный селектор
    expect(screen.getByText(/500.*likes/)).toBeInTheDocument();
    expect(screen.getByText(/750.*likes/)).toBeInTheDocument();
  });

  it('shows loading state when shorts are loading', () => {
    const { useShorts } = require('@/modules/shorts/hooks/useShorts');
    useShorts.mockReturnValue({
      shorts: [],
      loading: true,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsPage />);

    // Проверяем наличие loading элемента
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error state when shorts fail to load', () => {
    const { useShorts } = require('@/modules/shorts/hooks/useShorts');
    useShorts.mockReturnValue({
      shorts: [],
      loading: false,
      error: 'Failed to load shorts',
      refreshShorts: jest.fn(),
    });

    render(<ShortsPage />);

    expect(screen.getByText('Failed to load shorts')).toBeInTheDocument();
  });

  it('shows empty state when no shorts found', () => {
    const { useShorts } = require('@/modules/shorts/hooks/useShorts');
    useShorts.mockReturnValue({
      shorts: [],
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsPage />);

    expect(screen.getByText(/no shorts found/i)).toBeInTheDocument();
  });

  it('shows channel names correctly', async () => {
    render(<ShortsPage />);

    await waitFor(() => {
      expect(screen.getByText('Short Channel 1')).toBeInTheDocument();
      expect(screen.getByText('Short Channel 2')).toBeInTheDocument();
    });
  });

  it('shows subscriber counts correctly', async () => {
    render(<ShortsPage />);

    await waitFor(() => {
      expect(screen.getByText('1,000 subscribers')).toBeInTheDocument();
      expect(screen.getByText('500 subscribers')).toBeInTheDocument();
    });
  });

  it('shows video titles correctly', async () => {
    render(<ShortsPage />);

    await waitFor(() => {
      expect(screen.getByText('Amazing Short 1')).toBeInTheDocument();
      expect(screen.getByText('Amazing Short 2')).toBeInTheDocument();
    });
  });

  it('shows video descriptions correctly', async () => {
    render(<ShortsPage />);

    await waitFor(() => {
      expect(screen.getByText('This is an amazing short video')).toBeInTheDocument();
      expect(screen.getByText('Another amazing short video')).toBeInTheDocument();
    });
  });

  it('shows first interaction overlay', async () => {
    render(<ShortsPage />);

    await waitFor(() => {
      expect(screen.getByText('Tap to start')).toBeInTheDocument();
      expect(screen.getByText('Swipe up and down to navigate')).toBeInTheDocument();
    });
  });

  it('shows play button overlay', async () => {
    render(<ShortsPage />);

    await waitFor(() => {
      // Проверяем наличие кнопок воспроизведения
      const playButtons = screen.getAllByRole('button');
      expect(playButtons.length).toBeGreaterThan(0);
    });
  });
}); 