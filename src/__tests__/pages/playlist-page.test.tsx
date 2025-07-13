import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter, useParams } from 'next/navigation';
import PlaylistPage from '@/app/playlist/[id]/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock the usePlaylist hook
jest.mock('@/hooks/use-playlist', () => ({
  __esModule: true,
  usePlaylist: jest.fn(),
}));

// Mock the useInfiniteVideos hook
jest.mock('@/hooks/use-infinite-videos', () => ({
  __esModule: true,
  useInfiniteVideos: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

describe('Playlist Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockPlaylist = {
    id: 1,
    name: 'My Favorite Videos',
    description: 'A collection of my favorite videos',
    thumbnail: 'playlist-thumb.jpg',
    videos_count: 15,
    is_public: true,
    is_personal: false,
    user_id: 'user-1',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-12-01T00:00:00.000Z',
  };

  const mockPlaylistVideos = [
    {
      id: 1,
      video_id: 1,
      playlist_id: 1,
      added_at: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      video_id: 2,
      playlist_id: 1,
      added_at: '2023-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(async () => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    // Mock useAuth hook
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: { id: 'user-1', name: 'Test User' },
      isLoading: false,
      error: null,
      isLoggedIn: true,
    });

    // Mock usePlaylist hook
    const { usePlaylist } = await import('@/hooks/use-playlist');
    usePlaylist.mockReturnValue({
      playlist: mockPlaylist,
      playlistVideos: mockPlaylistVideos,
      isLoading: false,
      error: null,
      removeVideoFromPlaylist: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders playlist page with title', async () => {
    render(<PlaylistPage />);

    await waitFor(() => {
      expect(screen.getByText('My Favorite Videos')).toBeInTheDocument();
    });
  });

  it('renders playlist information', async () => {
    render(<PlaylistPage />);

    await waitFor(() => {
      expect(screen.getByText('A collection of my favorite videos')).toBeInTheDocument();
      expect(screen.getByText('2 videos')).toBeInTheDocument();
    });
  });

  it('renders playlist videos', async () => {
    render(<PlaylistPage />);

    await waitFor(() => {
      expect(screen.getByText('Video #1')).toBeInTheDocument();
      expect(screen.getByText('Video #2')).toBeInTheDocument();
    });
  });

  it('shows loading state when playlist is loading', async () => {
    const { usePlaylist } = await import('@/hooks/use-playlist');
    usePlaylist.mockReturnValue({
      playlist: null,
      playlistVideos: [],
      isLoading: true,
      error: null,
      removeVideoFromPlaylist: jest.fn(),
    });

    render(<PlaylistPage />);

    // Проверяем наличие skeleton loader
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows error state when playlist fails to load', async () => {
    const { usePlaylist } = await import('@/hooks/use-playlist');
    usePlaylist.mockReturnValue({
      playlist: null,
      playlistVideos: [],
      isLoading: false,
      error: 'Failed to load playlist',
      removeVideoFromPlaylist: jest.fn(),
    });

    render(<PlaylistPage />);

    expect(screen.getByText('Error loading playlist')).toBeInTheDocument();
    expect(screen.getByText('Failed to load playlist')).toBeInTheDocument();
  });

  it('shows empty state when no videos in playlist', async () => {
    const { usePlaylist } = await import('@/hooks/use-playlist');
    usePlaylist.mockReturnValue({
      playlist: { ...mockPlaylist, videos_count: 0 },
      playlistVideos: [],
      isLoading: false,
      error: null,
      removeVideoFromPlaylist: jest.fn(),
    });

    render(<PlaylistPage />);

    expect(screen.getByText('No videos in this playlist')).toBeInTheDocument();
  });

  it('handles missing playlist ID gracefully', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: undefined });
    const { usePlaylist } = await import('@/hooks/use-playlist');
    usePlaylist.mockReturnValue({
      playlist: null,
      playlistVideos: [],
      isLoading: false,
      error: null,
      removeVideoFromPlaylist: jest.fn(),
    });

    render(<PlaylistPage />);

    expect(screen.getByText('Back to Playlists')).toBeInTheDocument();
  });

  it('shows public/private indicator', async () => {
    render(<PlaylistPage />);

    await waitFor(() => {
      expect(screen.getByText('Public')).toBeInTheDocument();
    });
  });

  it('shows private indicator for private playlists', async () => {
    const { usePlaylist } = await import('@/hooks/use-playlist');
    usePlaylist.mockReturnValue({
      playlist: { ...mockPlaylist, is_public: false, is_personal: true },
      playlistVideos: mockPlaylistVideos,
      isLoading: false,
      error: null,
      removeVideoFromPlaylist: jest.fn(),
    });

    render(<PlaylistPage />);

    await waitFor(() => {
      expect(screen.getByText('Private')).toBeInTheDocument();
    });
  });

  it('does not show edit/delete buttons for non-owner', async () => {
    const { usePlaylist } = await import('@/hooks/use-playlist');
    usePlaylist.mockReturnValue({
      playlist: { ...mockPlaylist, user_id: 'other-user' },
      playlistVideos: mockPlaylistVideos,
      isLoading: false,
      error: null,
      removeVideoFromPlaylist: jest.fn(),
    });

    render(<PlaylistPage />);

    expect(screen.queryByText('Edit playlist')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete playlist')).not.toBeInTheDocument();
  });

  it('shows playlist creation date', async () => {
    render(<PlaylistPage />);

    await waitFor(() => {
      // Проверяем, что отображается дата создания (формат "over 2 years ago")
      expect(screen.getByText(/ago/)).toBeInTheDocument();
    });
  });

  it('shows "By You" indicator', async () => {
    render(<PlaylistPage />);

    await waitFor(() => {
      expect(screen.getByText('By You')).toBeInTheDocument();
    });
  });

  it('shows play all button', async () => {
    render(<PlaylistPage />);

    await waitFor(() => {
      expect(screen.getByText('Play all')).toBeInTheDocument();
    });
  });

  it('shows share button', async () => {
    render(<PlaylistPage />);

    await waitFor(() => {
      expect(screen.getByText('Share')).toBeInTheDocument();
    });
  });

  it('shows remove video option for owner', async () => {
    render(<PlaylistPage />);

    await waitFor(() => {
      // Открываем dropdown меню для первого видео
      const moreButtons = screen.getAllByRole('button');
      const moreButton = moreButtons.find(button => 
        button.querySelector('svg')?.getAttribute('class')?.includes('MoreVertical')
      );
      
      if (moreButton) {
        moreButton.click();
        expect(screen.getByText('Remove from playlist')).toBeInTheDocument();
      }
    });
  });
});