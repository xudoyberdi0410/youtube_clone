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



  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock useAuth hook
    const { useAuth } = require('@/modules/auth/hooks/use-auth');
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



  it('shows loading state when auth is loading', () => {
    const { useAuth } = require('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isLoggedIn: false,
      loading: true,
    });

    render(<YourVideosPage />);

    // Should show loading skeleton
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });





  it('requires authentication to access your videos', () => {
    const { useAuth } = require('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isLoggedIn: false,
      loading: false,
    });

    render(<YourVideosPage />);

    expect(screen.getByText('Sign in to view your videos')).toBeInTheDocument();
  });


}); 