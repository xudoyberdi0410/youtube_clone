import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShortsVideoCard } from '@/modules/shorts/ShortsVideoCard';
import { ShortVideo } from '@/modules/shorts/types';

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

const mockShort: ShortVideo = {
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
};

const mockShortWithoutChannel: ShortVideo = {
  id: '2',
  title: 'Test Short Video 2',
  description: 'This is another test short video',
  video_url: 'https://example.com/video2.mp4',
  thumbnail_url: 'https://example.com/thumbnail2.jpg',
  views_count: 2000,
  likes_count: 300,
  dislikes_count: 20,
  created_at: '2023-01-02T00:00:00Z',
};

describe('ShortsVideoCard', () => {
  const defaultProps = {
    short: mockShort,
    videoRef: jest.fn(),
    isPlaying: false,
    togglePlay: jest.fn(),
    autoPlay: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component correctly', () => {
    render(<ShortsVideoCard {...defaultProps} />);
    
    const container = screen.getByTestId('video-element').closest('div').parentElement;
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('w-full', 'h-screen', 'snap-center', 'flex', 'justify-center', 'items-center', 'relative', 'bg-transparent');
  });

  it('should render video element with correct attributes', () => {
    render(<ShortsVideoCard {...defaultProps} />);
    
    const video = screen.getByTestId('video-element');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', mockShort.video_url);
    expect(video).toHaveAttribute('data-id', mockShort.id);
    expect(video).toHaveAttribute('loop');
    // Check muted property instead of attribute since it's a boolean prop
    expect(video).toHaveProperty('muted', true);
    expect(video).toHaveAttribute('playsInline');
    expect(video).toHaveClass('h-full', 'max-h-screen', 'aspect-[9/16]', 'max-w-[calc(100vh*9/16)]', 'object-cover', 'rounded-xl', 'shadow-2xl', 'border', 'border-border', 'bg-card');
  });

  it('should render video title and channel name', () => {
    render(<ShortsVideoCard {...defaultProps} />);
    
    expect(screen.getByText(mockShort.title)).toBeInTheDocument();
    expect(screen.getByText(mockShort.channel!.channel_name)).toBeInTheDocument();
  });

  it('should render channel name as "Unknown" when channel is not provided', () => {
    render(<ShortsVideoCard {...defaultProps} short={mockShortWithoutChannel} />);
    
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('should render play button when not playing', () => {
    render(<ShortsVideoCard {...defaultProps} isPlaying={false} />);
    
    const playButton = screen.getByRole('button', { name: 'Воспроизвести' });
    expect(playButton).toBeInTheDocument();
    expect(screen.getByTestId('play-circle-icon')).toBeInTheDocument();
  });

  it('should render pause button when playing', () => {
    render(<ShortsVideoCard {...defaultProps} isPlaying={true} />);
    
    const pauseButton = screen.getByRole('button', { name: 'Пауза' });
    expect(pauseButton).toBeInTheDocument();
    expect(screen.getByTestId('pause-circle-icon')).toBeInTheDocument();
  });

  it('should call togglePlay when play/pause button is clicked', () => {
    const togglePlay = jest.fn();
    render(<ShortsVideoCard {...defaultProps} togglePlay={togglePlay} />);
    
    const playButton = screen.getByRole('button', { name: 'Воспроизвести' });
    fireEvent.click(playButton);
    
    expect(togglePlay).toHaveBeenCalledTimes(1);
  });

  it('should render like button with correct count', () => {
    render(<ShortsVideoCard {...defaultProps} />);
    
    expect(screen.getByTestId('thumbs-up-icon')).toBeInTheDocument();
    expect(screen.getByText(mockShort.likes_count.toString())).toBeInTheDocument();
  });

  it('should render comment button', () => {
    render(<ShortsVideoCard {...defaultProps} />);
    
    expect(screen.getByTestId('message-square-icon')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Default comment count
  });

  it('should render share button', () => {
    render(<ShortsVideoCard {...defaultProps} />);
    
    expect(screen.getByTestId('share2-icon')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('should set autoplay attribute when autoPlay prop is true', () => {
    render(<ShortsVideoCard {...defaultProps} autoPlay={true} />);
    
    const video = screen.getByTestId('video-element');
    expect(video).toHaveAttribute('autoPlay');
  });

  it('should not set autoplay attribute when autoPlay prop is false', () => {
    render(<ShortsVideoCard {...defaultProps} autoPlay={false} />);
    
    const video = screen.getByTestId('video-element');
    expect(video).not.toHaveAttribute('autoPlay');
  });

  it('should call videoRef with video element', () => {
    const videoRef = jest.fn();
    render(<ShortsVideoCard {...defaultProps} videoRef={videoRef} />);
    
    const video = screen.getByTestId('video-element');
    expect(videoRef).toHaveBeenCalledWith(video);
  });

  it('should render all action buttons in sidebar', () => {
    render(<ShortsVideoCard {...defaultProps} />);
    
    // Check if all icons are present
    expect(screen.getByTestId('thumbs-up-icon')).toBeInTheDocument();
    expect(screen.getByTestId('message-square-icon')).toBeInTheDocument();
    expect(screen.getByTestId('share2-icon')).toBeInTheDocument();
  });

  it('should have correct styling for video container', () => {
    render(<ShortsVideoCard {...defaultProps} />);
    
    const videoContainer = screen.getByTestId('video-element').parentElement;
    expect(videoContainer).toHaveClass('relative', 'flex', 'items-center', 'justify-center');
    expect(videoContainer).toHaveStyle({ height: '100vh' });
  });

  it('should have correct styling for sidebar', () => {
    render(<ShortsVideoCard {...defaultProps} />);
    
    const sidebar = screen.getByTestId('thumbs-up-icon').closest('div');
    expect(sidebar).toHaveClass('absolute', 'left-1/2', 'top-1/2', '-translate-y-1/2', 'translate-x-[calc(100vh*9/32+32px)]', 'flex', 'flex-col', 'space-y-5', 'pointer-events-auto', 'z-10');
  });
}); 