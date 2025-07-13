import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShortsFeed } from '@/modules/shorts/ShortsFeed';
import { useShorts } from '@/modules/shorts/hooks/useShorts';
import { ShortVideo } from '@/modules/shorts/types';

// Mock the useShorts hook
jest.mock('@/modules/shorts/hooks/useShorts');
const mockUseShorts = useShorts as jest.MockedFunction<typeof useShorts>;

// Mock the i18n function
jest.mock('@/lib/i18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'shorts.loading': 'Loading...',
      'shorts.somethingWentWrong': 'Something went wrong',
      'shorts.tryAgain': 'Try again',
      'shorts.noShortsFound': 'No shorts found',
      'shorts.checkBackLater': 'Check back later',
      'shorts.refresh': 'Refresh',
    };
    return translations[key] || key;
  },
}));

// Mock the Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, width, height }: { src: string; alt: string; className?: string; width?: number; height?: number }) => (
    <div data-testid="next-image" data-src={src} data-alt={alt} className={className} style={{ width, height }} />
  ),
}));

// Mock Heroicons
jest.mock('@heroicons/react/24/solid', () => ({
  PlayIcon: () => <span data-testid="play-icon">▶️</span>,
  PauseIcon: () => <span data-testid="pause-icon">⏸️</span>,
  SpeakerWaveIcon: () => <span data-testid="speaker-wave-icon">🔊</span>,
  SpeakerXMarkIcon: () => <span data-testid="speaker-xmark-icon">🔇</span>,
}));

// Mock CSS module
jest.mock('@/modules/shorts/styles.css', () => ({}));

const mockShorts: ShortVideo[] = [
  {
    id: '1',
    title: 'Test Short 1',
    description: 'Test description 1',
    video_url: 'https://example.com/video1.mp4',
    thumbnail_url: 'https://example.com/thumb1.jpg',
    views_count: 1000,
    likes_count: 100,
    dislikes_count: 10,
    created_at: '2023-01-01T00:00:00Z',
    channel: {
      id: '1',
      channel_name: 'Test Channel',
      profile_image_url: 'https://example.com/avatar.jpg',
      subscribers_count: 5000,
    },
  },
  {
    id: '2',
    title: 'Test Short 2',
    description: 'Test description 2',
    video_url: 'https://example.com/video2.mp4',
    thumbnail_url: 'https://example.com/thumb2.jpg',
    views_count: 2000,
    likes_count: 200,
    dislikes_count: 20,
    created_at: '2023-01-02T00:00:00Z',
    channel: {
      id: '2',
      channel_name: 'Test Channel 2',
      profile_image_url: 'https://example.com/avatar2.jpg',
      subscribers_count: 3000,
    },
  },
];

describe('ShortsFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock document.body.classList
    Object.defineProperty(document.body, 'classList', {
      value: {
        add: jest.fn(),
        remove: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render loading state', () => {
    mockUseShorts.mockReturnValue({
      shorts: [],
      loading: true,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsFeed />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render error state', () => {
    const refreshShorts = jest.fn();
    mockUseShorts.mockReturnValue({
      shorts: [],
      loading: false,
      error: 'Network error',
      refreshShorts,
    });

    render(<ShortsFeed />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('should call refreshShorts when try again button is clicked', () => {
    const refreshShorts = jest.fn();
    mockUseShorts.mockReturnValue({
      shorts: [],
      loading: false,
      error: 'Network error',
      refreshShorts,
    });

    render(<ShortsFeed />);
    
    const tryAgainButton = screen.getByRole('button', { name: 'Try again' });
    fireEvent.click(tryAgainButton);
    
    expect(refreshShorts).toHaveBeenCalledTimes(1);
  });

  it('should render empty state when no shorts are available', () => {
    const refreshShorts = jest.fn();
    mockUseShorts.mockReturnValue({
      shorts: [],
      loading: false,
      error: null,
      refreshShorts,
    });

    render(<ShortsFeed />);
    
    expect(screen.getByText('No shorts found')).toBeInTheDocument();
    expect(screen.getByText('Check back later')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });

  it('should call refreshShorts when refresh button is clicked in empty state', () => {
    const refreshShorts = jest.fn();
    mockUseShorts.mockReturnValue({
      shorts: [],
      loading: false,
      error: null,
      refreshShorts,
    });

    render(<ShortsFeed />);
    
    const refreshButton = screen.getByRole('button', { name: 'Refresh' });
    fireEvent.click(refreshButton);
    
    expect(refreshShorts).toHaveBeenCalledTimes(1);
  });

  it('should render shorts feed when data is available', () => {
    mockUseShorts.mockReturnValue({
      shorts: mockShorts,
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsFeed />);
    
    // Check if videos are rendered
    expect(screen.getByText('Test Short 1')).toBeInTheDocument();
    expect(screen.getByText('Test Short 2')).toBeInTheDocument();
    expect(screen.getByText('Test Channel')).toBeInTheDocument();
    expect(screen.getByText('Test Channel 2')).toBeInTheDocument();
  });

  it('should render first interaction overlay initially', () => {
    mockUseShorts.mockReturnValue({
      shorts: mockShorts,
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsFeed />);
    
    expect(screen.getByText('Tap to start')).toBeInTheDocument();
    expect(screen.getByText('Swipe up and down to navigate')).toBeInTheDocument();
    expect(screen.getAllByTestId('play-icon').length).toBeGreaterThan(0);
  });

  it('should hide first interaction overlay after user interaction', async () => {
    mockUseShorts.mockReturnValue({
      shorts: mockShorts,
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsFeed />);
    
    const overlay = screen.getByText('Tap to start').closest('div');
    expect(overlay).toBeInTheDocument();
    
    fireEvent.click(overlay!);
    
    await waitFor(() => {
      expect(screen.queryByText('Tap to start')).not.toBeInTheDocument();
    });
  });

  it('should render video elements with correct attributes', () => {
    mockUseShorts.mockReturnValue({
      shorts: mockShorts,
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsFeed />);
    
    const videos = screen.getAllByTestId('shorts-video');
    expect(videos).toHaveLength(2);
    
    expect(videos[0]).toHaveAttribute('src', mockShorts[0].video_url);
    expect(videos[0]).toHaveAttribute('loop');
    // muted property is controlled by state, so we check the property
    expect(videos[0]).toHaveProperty('muted', true);
    expect(videos[0]).toHaveAttribute('playsInline');
    expect(videos[0]).toHaveAttribute('preload', 'metadata');
  });

  it('should render channel avatars when available', () => {
    mockUseShorts.mockReturnValue({
      shorts: mockShorts,
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsFeed />);
    
    const images = screen.getAllByTestId('next-image');
    expect(images.length).toBeGreaterThan(0);
    
    const avatarImage = images.find(img => img.getAttribute('data-src') === mockShorts[0].channel!.profile_image_url);
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('data-alt', mockShorts[0].channel!.channel_name);
  });

  it('should render video stats correctly', () => {
    mockUseShorts.mockReturnValue({
      shorts: mockShorts,
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsFeed />);
    
    expect(screen.getByText('1,000 views • 100 likes')).toBeInTheDocument();
    expect(screen.getByText('2,000 views • 200 likes')).toBeInTheDocument();
  });

  it('should render subscriber count when available', () => {
    mockUseShorts.mockReturnValue({
      shorts: mockShorts,
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsFeed />);
    
    expect(screen.getByText('5,000 subscribers')).toBeInTheDocument();
    expect(screen.getByText('3,000 subscribers')).toBeInTheDocument();
  });

  it('should add and remove body class on mount and unmount', () => {
    mockUseShorts.mockReturnValue({
      shorts: mockShorts,
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });

    const { unmount } = render(<ShortsFeed />);
    
    expect(document.body.classList.add).toHaveBeenCalledWith('shorts-active');
    
    unmount();
    
    expect(document.body.classList.remove).toHaveBeenCalledWith('shorts-active');
  });

  it('should handle video play/pause interaction', async () => {
    mockUseShorts.mockReturnValue({
      shorts: mockShorts,
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsFeed />);
    
    // Wait for the first interaction overlay to be removed
    const overlay = screen.getByText('Tap to start').closest('div');
    fireEvent.click(overlay!);
    
    await waitFor(() => {
      expect(screen.queryByText('Tap to start')).not.toBeInTheDocument();
    });
    
    // Find and click on a video to test play/pause
    const videos = screen.getAllByTestId('shorts-video');
    expect(videos.length).toBeGreaterThan(0);
    
    // Mock video play/pause methods
    const mockPlay = jest.fn().mockResolvedValue(undefined);
    const mockPause = jest.fn();
    
    Object.defineProperty(videos[0], 'play', {
      value: mockPlay,
      writable: true,
    });
    
    Object.defineProperty(videos[0], 'pause', {
      value: mockPause,
      writable: true,
    });
    
    Object.defineProperty(videos[0], 'paused', {
      value: true,
      writable: true,
    });
    
    fireEvent.click(videos[0]);
    
    expect(mockPlay).toHaveBeenCalled();
  });

  it('should handle mute toggle interaction', async () => {
    mockUseShorts.mockReturnValue({
      shorts: mockShorts,
      loading: false,
      error: null,
      refreshShorts: jest.fn(),
    });

    render(<ShortsFeed />);
    
    // Remove first interaction overlay
    const overlay = screen.getByText('Tap to start').closest('div');
    fireEvent.click(overlay!);
    
    await waitFor(() => {
      expect(screen.queryByText('Tap to start')).not.toBeInTheDocument();
    });
    
    // Find mute toggle button
    const muteButtons = screen.getAllByTestId('speaker-xmark-icon');
    expect(muteButtons.length).toBeGreaterThan(0);
    
    // Mock video muted property
    const videos = screen.getAllByTestId('shorts-video');
    Object.defineProperty(videos[0], 'muted', {
      value: true,
      writable: true,
    });
    
    // Click mute toggle
    fireEvent.click(muteButtons[0].closest('button')!);
    
    // The muted property should be toggled
    expect(videos[0].muted).toBe(false);
  });
}); 