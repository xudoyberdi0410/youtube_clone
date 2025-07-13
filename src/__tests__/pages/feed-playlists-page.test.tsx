import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import PlaylistsPage from '@/app/feed/playlists/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the usePlaylists hook
jest.mock('@/hooks/use-playlists', () => ({
  __esModule: true,
  usePlaylists: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

describe('Feed Playlists Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockPlaylists = [
    {
      id: 'playlist-1',
      name: 'My Favorite Videos',
      description: 'A collection of my favorite videos',
      thumbnail: 'playlist-thumb-1.jpg',
      videoCount: 15,
      isPublic: true,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z',
    },
    {
      id: 'playlist-2',
      name: 'Music Videos',
      description: 'Great music videos',
      thumbnail: 'playlist-thumb-2.jpg',
      videoCount: 8,
      isPublic: false,
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2023-11-15T00:00:00Z',
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
      isLoggedIn: true,
    });

    // Mock usePlaylists hook
    const { usePlaylists } = await import('@/hooks/use-playlists');
    usePlaylists.mockReturnValue({
      playlists: mockPlaylists,
      isLoading: false,
      error: null,
      createPlaylist: jest.fn(),
      updatePlaylist: jest.fn(),
      deletePlaylist: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders playlists page with title', async () => {
    render(<PlaylistsPage />);

    await waitFor(() => {
      expect(screen.getByText('Playlists')).toBeInTheDocument();
    });
  });

  it('shows loading state when playlists are loading', async () => {
    const { usePlaylists } = await import('@/hooks/use-playlists');
    usePlaylists.mockReturnValue({
      playlists: [],
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<PlaylistsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state when playlists fail to load', async () => {
    const { usePlaylists } = await import('@/hooks/use-playlists');
    usePlaylists.mockReturnValue({
      playlists: [],
      isLoading: false,
      error: 'Failed to load playlists',
      refetch: jest.fn(),
    });

    render(<PlaylistsPage />);
    expect(screen.getByText('Failed to load playlists')).toBeInTheDocument();
  });

  it('shows empty state when no playlists found', async () => {
    const { usePlaylists } = await import('@/hooks/use-playlists');
    usePlaylists.mockReturnValue({
      playlists: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<PlaylistsPage />);
    expect(screen.getByText('No playlists yet')).toBeInTheDocument();
  });

  it('requires authentication to access playlists', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: false,
      user: null,
      loading: false,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<PlaylistsPage />);
    // AuthRequiredDialog should be rendered when not logged in
    expect(screen.getByText('Sign in to view your playlists')).toBeInTheDocument();
  });

  it('shows create playlist button', async () => {
    render(<PlaylistsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Create Playlist/)).toBeInTheDocument();
    });
  });

  it('shows playlist cards when playlists exist', async () => {
    render(<PlaylistsPage />);

    await waitFor(() => {
      expect(screen.getByText('My Favorite Videos')).toBeInTheDocument();
      expect(screen.getByText('Music Videos')).toBeInTheDocument();
    });
  });

  it('shows playlist descriptions', async () => {
    render(<PlaylistsPage />);

    await waitFor(() => {
      expect(screen.getByText('A collection of my favorite videos')).toBeInTheDocument();
      expect(screen.getByText('Great music videos')).toBeInTheDocument();
    });
  });
}); 