import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { VideosPage } from '@/modules/studio/pages/VideosPage';

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

describe('Studio Videos Page', () => {
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
}); 