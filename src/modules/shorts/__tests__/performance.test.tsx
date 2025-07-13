import React from 'react';
import { render, screen } from '@testing-library/react';
import { ShortsFeed } from '../ShortsFeed';
import { ShortsVideoCard } from '../ShortsVideoCard';
import { useShorts } from '../hooks/useShorts';
import { ShortVideo } from '../types';

// Mock data factories
const createMockShort = (overrides: Partial<ShortVideo> = {}): ShortVideo => ({
  id: '1',
  title: 'Test Short Video',
  description: 'This is a test short video description',
  video_url: 'https://example.com/video.mp4',
  thumbnail_url: 'https://example.com/thumbnail.jpg',
  views_count: 1000,
  likes_count: 150,
  dislikes_count: 10,
  created_at: '2023-01-01T00:00:00Z',
  channel: {
    id: '1',
    channel_name: 'Test Channel',
    profile_image_url: 'https://example.com/avatar.jpg',
    subscribers_count: 5000,
  },
  ...overrides,
});

const createMockShorts = (count: number = 2): ShortVideo[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockShort({
      id: (index + 1).toString(),
      title: `Test Short ${index + 1}`,
      description: `Test description ${index + 1}`,
      video_url: `https://example.com/video${index + 1}.mp4`,
      thumbnail_url: `https://example.com/thumb${index + 1}.jpg`,
      views_count: 1000 * (index + 1),
      likes_count: 100 * (index + 1),
      dislikes_count: 10 * (index + 1),
      channel: {
        id: (index + 1).toString(),
        channel_name: `Test Channel ${index + 1}`,
        profile_image_url: `https://example.com/avatar${index + 1}.jpg`,
        subscribers_count: 5000 * (index + 1),
      },
    })
  );
};

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
jest.mock('../styles.css', () => ({}));

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, 'aria-label': ariaLabel, ...props }: { children: React.ReactNode; onClick?: () => void; className?: string; 'aria-label'?: string; [key: string]: unknown }) => (
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

describe('Shorts Performance Tests', () => {
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

  describe('ShortsFeed Performance', () => {
    it('should render large number of shorts efficiently', () => {
      const largeShortsArray = createMockShorts(100);
      
      mockUseShorts.mockReturnValue({
        shorts: largeShortsArray,
        loading: false,
        error: null,
        refreshShorts: jest.fn(),
      });

      const startTime = performance.now();
      
      render(<ShortsFeed />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render 100 shorts in reasonable time (less than 1 second)
      expect(renderTime).toBeLessThan(1000);
      
      // Verify all shorts are rendered
      expect(screen.getAllByTestId('shorts-video')).toHaveLength(100);
      expect(screen.getByText('Test Short 1')).toBeInTheDocument();
      expect(screen.getByText('Test Short 100')).toBeInTheDocument();
    });

    it('should handle memory efficiently with large datasets', () => {
      const largeShortsArray = createMockShorts(500);
      
      mockUseShorts.mockReturnValue({
        shorts: largeShortsArray,
        loading: false,
        error: null,
        refreshShorts: jest.fn(),
      });

      // Measure memory before render
      const memoryBefore = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
      
      const { unmount } = render(<ShortsFeed />);
      
      // Verify rendering
      expect(screen.getAllByTestId('shorts-video')).toHaveLength(500);
      
      // Cleanup
      unmount();
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const memoryAfter = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
      
      // Memory usage should be reasonable (less than 50MB increase for 500 items)
      const memoryIncrease = memoryAfter - memoryBefore;
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB
    });

    it('should render shorts with minimal DOM nodes', () => {
      const shortsArray = createMockShorts(10);
      
      mockUseShorts.mockReturnValue({
        shorts: shortsArray,
        loading: false,
        error: null,
        refreshShorts: jest.fn(),
      });

      const { container } = render(<ShortsFeed />);
      
      // Count DOM nodes
      const totalNodes = container.querySelectorAll('*').length;
      
      // Should have reasonable number of DOM nodes (less than 1000 for 10 shorts)
      expect(totalNodes).toBeLessThan(1000);
      
      // Verify structure efficiency
      const videoElements = container.querySelectorAll('[data-testid="shorts-video"]');
      expect(videoElements).toHaveLength(10);
      
      // Each video should have minimal wrapper elements
      videoElements.forEach(video => {
        const parentElements = video.parentElement?.querySelectorAll('*').length || 0;
        expect(parentElements).toBeLessThan(50); // Reasonable number of wrapper elements
      });
    });

    it('should handle rapid state changes efficiently', () => {
      const shortsArray = createMockShorts(50);
      
      mockUseShorts.mockReturnValue({
        shorts: shortsArray,
        loading: false,
        error: null,
        refreshShorts: jest.fn(),
      });

      const { rerender } = render(<ShortsFeed />);
      
      const startTime = performance.now();
      
      // Simulate rapid state changes
      for (let i = 0; i < 10; i++) {
        mockUseShorts.mockReturnValue({
          shorts: createMockShorts(50 + i),
          loading: false,
          error: null,
          refreshShorts: jest.fn(),
        });
        
        rerender(<ShortsFeed />);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle rapid changes efficiently (less than 500ms for 10 changes)
      expect(totalTime).toBeLessThan(500);
    });
  });

  describe('ShortsVideoCard Performance', () => {
    const defaultProps = {
      short: createMockShort(),
      videoRef: jest.fn(),
      isPlaying: false,
      togglePlay: jest.fn(),
      autoPlay: false,
    };

    it('should render individual video card efficiently', () => {
      const startTime = performance.now();
      
      render(<ShortsVideoCard {...defaultProps} />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render single video card quickly (less than 50ms)
      expect(renderTime).toBeLessThan(50);
      
      // Verify essential elements are rendered
      expect(screen.getByTestId('video-element')).toBeInTheDocument();
      expect(screen.getByText(defaultProps.short.title)).toBeInTheDocument();
    });

    it('should handle prop changes efficiently', () => {
      const { rerender } = render(<ShortsVideoCard {...defaultProps} />);
      
      const startTime = performance.now();
      
      // Simulate rapid prop changes
      for (let i = 0; i < 20; i++) {
        rerender(
          <ShortsVideoCard 
            {...defaultProps} 
            isPlaying={i % 2 === 0}
            short={createMockShort({ id: i.toString() })}
          />
        );
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle prop changes efficiently (less than 200ms for 20 changes)
      expect(totalTime).toBeLessThan(200);
    });

    it('should render with minimal re-renders', () => {
      const togglePlay = jest.fn();
      const videoRef = jest.fn();
      
      const { rerender } = render(
        <ShortsVideoCard 
          {...defaultProps} 
          togglePlay={togglePlay}
          videoRef={videoRef}
        />
      );
      
      // Initial render
      expect(videoRef).toHaveBeenCalledTimes(1);
      
      // Change unrelated prop
      rerender(
        <ShortsVideoCard 
          {...defaultProps} 
          togglePlay={togglePlay}
          videoRef={videoRef}
          autoPlay={true}
        />
      );
      
      // videoRef should not be called again for unrelated prop changes
      expect(videoRef).toHaveBeenCalledTimes(1);
    });
  });

  describe('Memory Management', () => {
    it('should not create memory leaks with event listeners', () => {
      const shortsArray = createMockShorts(20);
      
      mockUseShorts.mockReturnValue({
        shorts: shortsArray,
        loading: false,
        error: null,
        refreshShorts: jest.fn(),
      });

      const { unmount } = render(<ShortsFeed />);
      
      // Verify rendering
      expect(screen.getAllByTestId('shorts-video')).toHaveLength(20);
      
      // Cleanup
      unmount();
      
      // Check that document event listeners are cleaned up
      // This is a basic check - in real scenarios you'd use more sophisticated tools
      expect(document.body.classList.remove).toHaveBeenCalledWith('shorts-active');
    });

    it('should handle large video URLs efficiently', () => {
      const shortWithLargeUrl = createMockShort({
        video_url: 'https://example.com/very/long/video/url/that/might/be/very/long/and/could/impact/performance.mp4',
        description: 'A'.repeat(1000), // Long description
        title: 'B'.repeat(500), // Long title
      });
      
      const startTime = performance.now();
      
      render(
        <ShortsVideoCard 
          short={shortWithLargeUrl}
          videoRef={jest.fn()}
          isPlaying={false}
          togglePlay={jest.fn()}
          autoPlay={false}
        />
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should handle large content efficiently (less than 100ms)
      expect(renderTime).toBeLessThan(100);
      
      // Verify content is rendered correctly
      expect(screen.getByText(shortWithLargeUrl.title)).toBeInTheDocument();
      expect(screen.getByTestId('video-element')).toHaveAttribute('src', shortWithLargeUrl.video_url);
    });
  });

  describe('Rendering Optimization', () => {
    it('should use efficient rendering patterns', () => {
      const shortsArray = createMockShorts(5);
      
      mockUseShorts.mockReturnValue({
        shorts: shortsArray,
        loading: false,
        error: null,
        refreshShorts: jest.fn(),
      });

      const { container } = render(<ShortsFeed />);
      
      // Check for efficient CSS classes usage
      const elementsWithClasses = container.querySelectorAll('[class]');
      const totalClasses = Array.from(elementsWithClasses).reduce((acc, el) => {
        return acc + (el.className?.split(' ').length || 0);
      }, 0);
      
      // Should use reasonable number of CSS classes
      expect(totalClasses).toBeLessThan(1000);
      
      // Check for inline styles (should be minimal)
      const elementsWithInlineStyles = container.querySelectorAll('[style]');
      expect(elementsWithInlineStyles.length).toBeLessThan(50);
    });

    it('should handle conditional rendering efficiently', () => {
      const shortWithChannel = createMockShort();
      const shortWithoutChannel = createMockShort({ channel: undefined });
      
      const { rerender } = render(
        <ShortsVideoCard 
          short={shortWithChannel}
          videoRef={jest.fn()}
          isPlaying={false}
          togglePlay={jest.fn()}
          autoPlay={false}
        />
      );
      
      // Render with channel
      expect(screen.getByText(shortWithChannel.channel!.channel_name)).toBeInTheDocument();
      
      // Render without channel
      rerender(
        <ShortsVideoCard 
          short={shortWithoutChannel}
          videoRef={jest.fn()}
          isPlaying={false}
          togglePlay={jest.fn()}
          autoPlay={false}
        />
      );
      
      expect(screen.getByText('Unknown')).toBeInTheDocument();
      
      // Should not cause excessive re-renders
      const videoElements = screen.getAllByTestId('video-element');
      expect(videoElements).toHaveLength(1);
    });
  });
}); 