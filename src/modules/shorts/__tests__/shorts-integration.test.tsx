import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShortsFeed } from '../ShortsFeed';
import { ShortsVideoCard } from '../ShortsVideoCard';
import { useShorts } from '../hooks/useShorts';
import { ShortVideo } from '../types';

// Mock the useShorts hook
jest.mock('../hooks/useShorts');
const mockUseShorts = useShorts as jest.MockedFunction<typeof useShorts>;

// Mock the i18n function
jest.mock('../../../lib/i18n', () => ({
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
  default: ({ src, alt, className, width, height, unoptimized }: any) => (
    <img src={src} alt={alt} className={className} width={width} height={height} data-testid="next-image" />
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
jest.mock('../styles.css', () => ({}));

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, variant, size, 'aria-label': ariaLabel, ...props }: any) => (
    <button onClick={onClick} className={className} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ThumbsUp: () => <span data-testid="thumbs-up-icon">👍</span>,
  MessageSquare: () => <span data-testid="message-square-icon">💬</span>,
  Share2: () => <span data-testid="share2-icon">↗️</span>,
  PlayCircle: () => <span data-testid="play-circle-icon">▶️</span>,
  PauseCircle: () => <span data-testid="pause-circle-icon">⏸️</span>,
}));

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

describe('Shorts Module Integration', () => {
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

  describe('ShortsFeed Integration', () => {
    it('should handle complete flow from loading to displaying shorts', async () => {
      const refreshShorts = jest.fn();
      
      // Start with loading state
      mockUseShorts.mockReturnValue({
        shorts: [],
        loading: true,
        error: null,
        refreshShorts,
      });

      const { rerender } = render(<ShortsFeed />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      // Transition to loaded state
      mockUseShorts.mockReturnValue({
        shorts: mockShorts,
        loading: false,
        error: null,
        refreshShorts,
      });

      rerender(<ShortsFeed />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      expect(screen.getByText('Test Short 1')).toBeInTheDocument();
      expect(screen.getByText('Test Short 2')).toBeInTheDocument();
      expect(screen.getByText('Test Channel')).toBeInTheDocument();
      expect(screen.getByText('Test Channel 2')).toBeInTheDocument();
    });

    it('should handle error state and recovery', async () => {
      const refreshShorts = jest.fn();
      
      // Start with error state
      mockUseShorts.mockReturnValue({
        shorts: [],
        loading: false,
        error: 'Network error',
        refreshShorts,
      });

      render(<ShortsFeed />);
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
      
      // Click try again button
      const tryAgainButton = screen.getByRole('button', { name: 'Try again' });
      fireEvent.click(tryAgainButton);
      
      expect(refreshShorts).toHaveBeenCalledTimes(1);
    });

    it('should handle user interaction flow', async () => {
      mockUseShorts.mockReturnValue({
        shorts: mockShorts,
        loading: false,
        error: null,
        refreshShorts: jest.fn(),
      });

      render(<ShortsFeed />);
      
      // Check initial overlay
      expect(screen.getByText('Tap to start')).toBeInTheDocument();
      
      // Remove overlay
      const overlay = screen.getByText('Tap to start').closest('div');
      fireEvent.click(overlay!);
      
      await waitFor(() => {
        expect(screen.queryByText('Tap to start')).not.toBeInTheDocument();
      });
      
      // Check that videos are now interactive
      const videos = screen.getAllByTestId('shorts-video');
      expect(videos).toHaveLength(2);
      
      // Mock video methods for interaction testing
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
      
      // Test video interaction
      fireEvent.click(videos[0]);
      expect(mockPlay).toHaveBeenCalled();
    });
  });

  describe('ShortsVideoCard Integration', () => {
    const defaultProps = {
      short: mockShorts[0],
      videoRef: jest.fn(),
      isPlaying: false,
      togglePlay: jest.fn(),
      autoPlay: false,
    };

    it('should render with correct data and handle interactions', () => {
      const togglePlay = jest.fn();
      render(<ShortsVideoCard {...defaultProps} togglePlay={togglePlay} />);
      
      // Check video element
      const video = screen.getByTestId('video-element');
      expect(video).toHaveAttribute('src', mockShorts[0].video_url);
      expect(video).toHaveAttribute('data-id', mockShorts[0].id);
      
      // Check content
      expect(screen.getByText(mockShorts[0].title)).toBeInTheDocument();
      expect(screen.getByText(mockShorts[0].channel!.channel_name)).toBeInTheDocument();
      expect(screen.getByText(mockShorts[0].likes_count.toString())).toBeInTheDocument();
      
      // Test play button interaction
      const playButton = screen.getByRole('button', { name: 'Воспроизвести' });
      fireEvent.click(playButton);
      expect(togglePlay).toHaveBeenCalledTimes(1);
    });

    it('should handle play/pause state changes', () => {
      const { rerender } = render(<ShortsVideoCard {...defaultProps} isPlaying={false} />);
      
      // Check play button when not playing
      expect(screen.getByRole('button', { name: 'Воспроизвести' })).toBeInTheDocument();
      expect(screen.getByTestId('play-circle-icon')).toBeInTheDocument();
      
      // Change to playing state
      rerender(<ShortsVideoCard {...defaultProps} isPlaying={true} />);
      
      // Check pause button when playing
      expect(screen.getByRole('button', { name: 'Пауза' })).toBeInTheDocument();
      expect(screen.getByTestId('pause-circle-icon')).toBeInTheDocument();
    });

    it('should handle autoplay prop correctly', () => {
      render(<ShortsVideoCard {...defaultProps} autoPlay={true} />);
      
      const video = screen.getByTestId('video-element');
      expect(video).toHaveAttribute('autoPlay');
    });

    it('should render action buttons with correct data', () => {
      render(<ShortsVideoCard {...defaultProps} />);
      
      // Check like button
      expect(screen.getByTestId('thumbs-up-icon')).toBeInTheDocument();
      expect(screen.getByText(mockShorts[0].likes_count.toString())).toBeInTheDocument();
      
      // Check comment button
      expect(screen.getByTestId('message-square-icon')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // Default comment count
      
      // Check share button
      expect(screen.getByTestId('share2-icon')).toBeInTheDocument();
      expect(screen.getByText('Share')).toBeInTheDocument();
    });
  });

  describe('Data Flow Integration', () => {
    it('should handle shorts data transformation correctly', () => {
      const refreshShorts = jest.fn();
      mockUseShorts.mockReturnValue({
        shorts: mockShorts,
        loading: false,
        error: null,
        refreshShorts,
      });

      render(<ShortsFeed />);
      
      // Verify that all shorts data is properly displayed
      mockShorts.forEach(short => {
        expect(screen.getByText(short.title)).toBeInTheDocument();
        if (short.channel) {
          expect(screen.getByText(short.channel.channel_name)).toBeInTheDocument();
          expect(screen.getByText(`${short.channel.subscribers_count.toLocaleString()} subscribers`)).toBeInTheDocument();
        }
        expect(screen.getByText(`${short.views_count.toLocaleString()} views • ${short.likes_count.toLocaleString()} likes`)).toBeInTheDocument();
      });
    });

    it('should handle empty shorts array gracefully', () => {
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

    it('should handle shorts with missing channel data', () => {
      const shortsWithoutChannel = [
        {
          ...mockShorts[0],
          channel: undefined,
        },
      ];
      
      const refreshShorts = jest.fn();
      mockUseShorts.mockReturnValue({
        shorts: shortsWithoutChannel,
        loading: false,
        error: null,
        refreshShorts,
      });

      render(<ShortsFeed />);
      
      // Should display "Unknown" for missing channel name
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain proper accessibility throughout the flow', () => {
      mockUseShorts.mockReturnValue({
        shorts: mockShorts,
        loading: false,
        error: null,
        refreshShorts: jest.fn(),
      });

      render(<ShortsFeed />);
      
      // Check video accessibility
      const videos = screen.getAllByTestId('shorts-video');
      videos.forEach(video => {
        expect(video).toHaveAttribute('src');
        expect(video).toHaveAttribute('loop');
        expect(video).toHaveProperty('muted', true);
        expect(video).toHaveAttribute('playsInline');
      });
      
      // Check button accessibility
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('should provide proper ARIA labels for interactive elements', () => {
      const togglePlay = jest.fn();
      render(<ShortsVideoCard 
        short={mockShorts[0]}
        videoRef={jest.fn()}
        isPlaying={false}
        togglePlay={togglePlay}
        autoPlay={false}
      />);
      
      // Check play button has proper aria-label
      const playButton = screen.getByRole('button', { name: 'Воспроизвести' });
      expect(playButton).toBeInTheDocument();
    });
  });
}); 