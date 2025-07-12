import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import HomeVideos from '@/modules/home/ui/components/home-videos';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Мокаем useInfiniteVideos
jest.mock('@/hooks/use-infinite-videos', () => ({
  useInfiniteVideos: jest.fn()
}));

// Мокаем VideoCardWithPreview
jest.mock('@/components/video/VideoCardWithPreview', () => ({
  VideoCardWithPreview: ({ title, channel }: any) => (
    <div data-testid="video-card">
      <h3>{title}</h3>
      <p>{channel.name}</p>
    </div>
  ),
}));

// Мокаем хуки, используемые в VideoCardWithPreview
jest.mock('@/hooks/use-video-preview', () => ({
  useVideoPreview: jest.fn(() => ({
    videoRef: { current: null },
    isPreviewing: false,
    currentTime: 0,
    duration: 0,
    isMuted: true,
    handleMouseEnter: jest.fn(),
    handleMouseLeave: jest.fn(),
    handleTimeUpdate: jest.fn(),
    handleLoadedMetadata: jest.fn(),
    toggleMute: jest.fn(),
  })),
}));

jest.mock('@/hooks/use-instant-play', () => ({
  useInstantPlay: jest.fn(() => ({
    navigateToWatch: jest.fn(),
  })),
}));

import { useInfiniteVideos } from '@/hooks/use-infinite-videos';

const mockVideos = [
  {
    id: '1',
    title: 'Test Video 1',
    description: 'Description 1',
    views: 100,
    channel: {
      id: 'c1',
      name: 'Channel 1',
      avatarUrl: '',
      isVerified: false
    },
    preview: 'https://example.com/preview1.jpg',
    videoUrl: 'https://example.com/video1.mp4',
    duration: '01:00',
    uploadedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Test Video 2',
    description: 'Description 2',
    views: 200,
    channel: {
      id: 'c2',
      name: 'Channel 2',
      avatarUrl: '',
      isVerified: true
    },
    preview: 'https://example.com/preview2.jpg',
    videoUrl: 'https://example.com/video2.mp4',
    duration: '02:00',
    uploadedAt: '2023-01-02T00:00:00Z',
  }
];

describe('Home Page (integration)', () => {
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

  it('renders video list', () => {
    (useInfiniteVideos as jest.Mock).mockReturnValue({
      videos: mockVideos,
      isLoading: false,
      isLoadingMore: false,
      error: null,
      hasMore: false,
      refetch: jest.fn(),
      changeCategory: jest.fn(),
      loadMore: jest.fn(),
    });

    render(<HomeVideos />);

    expect(screen.getByText('Test Video 1')).toBeInTheDocument();
    expect(screen.getByText('Test Video 2')).toBeInTheDocument();
  });

  it('shows empty state if no videos', () => {
    (useInfiniteVideos as jest.Mock).mockReturnValue({
      videos: [],
      isLoading: false,
      isLoadingMore: false,
      error: null,
      hasMore: false,
      refetch: jest.fn(),
      changeCategory: jest.fn(),
      loadMore: jest.fn(),
    });

    render(<HomeVideos />);
    // Проверяем наличие кнопки refresh в пустом состоянии (используем getAllByText для множественных элементов)
    expect(screen.getAllByText(/refresh/i).length).toBeGreaterThan(0);
  });

  it('shows loading skeletons', () => {
    (useInfiniteVideos as jest.Mock).mockReturnValue({
      videos: [],
      isLoading: true,
      isLoadingMore: false,
      error: null,
      hasMore: false,
      refetch: jest.fn(),
      changeCategory: jest.fn(),
      loadMore: jest.fn(),
    });

    render(<HomeVideos />);
    // Проверяем наличие skeleton элементов по классу
    expect(document.querySelectorAll('.animate-\\[shimmer_1\\.5s_ease-in-out_infinite\\]').length).toBeGreaterThan(0);
  });

  it('shows error alert and retry button', () => {
    const refetch = jest.fn();
    (useInfiniteVideos as jest.Mock).mockReturnValue({
      videos: [],
      isLoading: false,
      isLoadingMore: false,
      error: 'Network error',
      hasMore: false,
      refetch,
      changeCategory: jest.fn(),
      loadMore: jest.fn(),
    });

    render(<HomeVideos />);
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
    const retryBtn = screen.getByText(/retry/i);
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);
    expect(refetch).toHaveBeenCalled();
  });
}); 