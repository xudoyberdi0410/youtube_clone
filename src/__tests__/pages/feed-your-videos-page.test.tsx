import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import YourVideosPage from '@/app/feed/your-videos/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));



// Mock the useAuth hook
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

describe('Feed Your Videos Page', () => {
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

    // Mock useAuth hook
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: { id: 'user-1', name: 'Test User' },
      isLoading: false,
      error: null,
      isAuthenticated: true,
      isLoggedIn: true,
      loading: false,
    });


  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders your videos page with title', async () => {
    render(<YourVideosPage />);

    await waitFor(() => {
      expect(screen.getByText('Your videos')).toBeInTheDocument();
    });
  });

  it('renders empty state when user is authenticated', async () => {
    render(<YourVideosPage />);

    await waitFor(() => {
      expect(screen.getByText('No videos uploaded yet')).toBeInTheDocument();
      expect(screen.getByText('Upload your first video to get started')).toBeInTheDocument();
    });
  });



  it('shows loading state when videos are loading', async () => {
    const { useVideos } = await import('@/hooks/use-videos');
    useVideos.mockReturnValue({
      videos: [],
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<YourVideosPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state when videos fail to load', async () => {
    const { useVideos } = await import('@/hooks/use-videos');
    useVideos.mockReturnValue({
      videos: [],
      isLoading: false,
      error: 'Failed to load videos',
      refetch: jest.fn(),
    });

    render(<YourVideosPage />);
    expect(screen.getByText('Failed to load videos')).toBeInTheDocument();
  });

  it('shows empty state when no videos found', async () => {
    const { useVideos } = await import('@/hooks/use-videos');
    useVideos.mockReturnValue({
      videos: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<YourVideosPage />);
    expect(screen.getByText('No videos found')).toBeInTheDocument();
  });





  it('requires authentication to access your videos', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: null,
      isLoggedIn: false,
      loading: false,
    });

    render(<YourVideosPage />);
    expect(screen.getByText('Sign in to view your videos')).toBeInTheDocument();
  });


}); 