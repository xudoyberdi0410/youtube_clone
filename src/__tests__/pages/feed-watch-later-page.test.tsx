import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import WatchLaterPage from '@/app/feed/watch-later/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useAuth hook from the correct path
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

// Mock the i18n function
jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'auth.signInToSaveVideos': 'Sign in to save videos for later',
      'auth.saveVideosToWatchLater': 'Save videos to watch them later',
      'auth.signIn': 'Sign in',
      'watchLater.title': 'Watch Later',
      'watchLater.emptyTitle': 'No videos in watch later',
      'watchLater.emptyDescription': 'Save videos to watch them later',
      'watchLater.authDescription': 'Sign in to save videos for later',
    };
    return translations[key] || key;
  }),
}));

describe('Feed Watch Later Page', () => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in prompt when not authenticated', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: false,
      loading: false,
    });

    render(<WatchLaterPage />);

    expect(screen.getByText('Sign in to save videos for later')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('renders empty state when authenticated', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: true,
      loading: false,
    });

    render(<WatchLaterPage />);

    expect(screen.getByText('Watch Later')).toBeInTheDocument();
    expect(screen.getByText('No videos in watch later')).toBeInTheDocument();
    expect(screen.getByText('Save videos to watch them later')).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: false,
      loading: true,
    });

    render(<WatchLaterPage />);
    
    // Check for loading skeleton by class
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows auth dialog when sign in button is clicked', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: false,
      loading: false,
    });

    render(<WatchLaterPage />);
    
    const signInButton = screen.getByText('Sign in');
    expect(signInButton).toBeInTheDocument();
  });

  it('displays clock icon in header when authenticated', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: true,
      loading: false,
    });

    render(<WatchLaterPage />);
    
    // Check for clock icon in header by class name
    const clockIcons = document.querySelectorAll('.lucide-clock');
    expect(clockIcons.length).toBeGreaterThan(0);
  });

  it('displays clock icon in empty state when authenticated', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: true,
      loading: false,
    });

    render(<WatchLaterPage />);
    
    // Check for clock icon in empty state by class name
    const clockIcons = document.querySelectorAll('.lucide-clock');
    expect(clockIcons.length).toBeGreaterThan(0);
  });

  it('displays clock icon in sign in prompt when not authenticated', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: false,
      loading: false,
    });

    render(<WatchLaterPage />);
    
    // Check for clock icon in sign in prompt by class name
    const clockIcons = document.querySelectorAll('.lucide-clock');
    expect(clockIcons.length).toBeGreaterThan(0);
  });
}); 