import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { VideosPage } from '@/modules/studio/pages/VideosPage';
import { useMyVideos } from '@/hooks/use-videos';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

// Mock i18n
jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
}));

// Mock useMyVideos
jest.mock('@/hooks/use-videos', () => ({
  __esModule: true,
  useMyVideos: jest.fn(),
}));

describe('Studio Videos Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockVideos = [
    {
      id: '1',
      title: 'Test Video 1',
      thumbnail: '/test1.jpg',
      duration: '10:00',
      status: 'published',
      views: 100,
      likes: 5,
      uploadedAt: '2024-01-01T00:00:00Z',
      visibility: 'public',
    },
    {
      id: '2',
      title: 'Test Video 2',
      thumbnail: '/test2.jpg',
      duration: '5:00',
      status: 'published',
      views: 50,
      likes: 2,
      uploadedAt: '2024-01-02T00:00:00Z',
      visibility: 'public',
    },
  ];

  beforeEach(async () => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock useAuth hook
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: { id: 'user-1', name: 'Test User' },
      isLoading: false,
      error: null,
      isAuthenticated: true,
    });

    // Mock useMyVideos
    (useMyVideos as jest.Mock).mockReturnValue({
      videos: mockVideos,
      isLoading: false,
      error: null,
      loadVideos: jest.fn(),
      refetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders videos page with title', async () => {
    render(<VideosPage />);

    await waitFor(() => {
      expect(screen.getByText('studio.videos')).toBeInTheDocument();
    });
  });

  it('renders page description', async () => {
    render(<VideosPage />);

    await waitFor(() => {
      expect(screen.getByText('Manage your videos, edit details, and track performance.')).toBeInTheDocument();
    });
  });

  it('renders add video button', async () => {
    render(<VideosPage />);

    await waitFor(() => {
      expect(screen.getByText('studio.addVideo')).toBeInTheDocument();
    });
  });

  it('renders search input', async () => {
    render(<VideosPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('studio.searchVideos')).toBeInTheDocument();
    });
  });

  it('renders filter dropdown', async () => {
    render(<VideosPage />);

    await waitFor(() => {
      expect(screen.getByText('studio.filterAll')).toBeInTheDocument();
    });
  });

  it('renders video table', async () => {
    render(<VideosPage />);

    await waitFor(() => {
      expect(screen.getByText('Video')).toBeInTheDocument();
    });
  });

  it('renders videos from API in the table', async () => {
    render(<VideosPage />);
    await waitFor(() => {
      expect(screen.getByText('Test Video 1')).toBeInTheDocument();
      expect(screen.getByText('Test Video 2')).toBeInTheDocument();
    });
  });
}); 