import { render, screen } from '@testing-library/react';
import { DashboardPage } from '@/modules/studio/pages/DashboardPage';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

// Mock the mock data
jest.mock('@/lib/mock/studio-data', () => ({
  mockDashboardStats: {
    totalViews: 100000,
    totalLikes: 5000,
    totalComments: 1000,
    totalSubscribers: 500,
    totalVideos: 25
  },
  mockAnalytics: {
    views: 45678,
    watchTime: 1234567,
    subscribers: 2345,
    ctr: 4.2,
    viewsByDay: [
      { date: '2024-01-15', views: 1234 },
      { date: '2024-01-16', views: 1456 }
    ],
    trafficSources: [
      { source: 'YouTube Search', percentage: 45 },
      { source: 'External', percentage: 30 }
    ]
  },
  mockComments: [
    {
      id: '1',
      videoId: '1',
      videoTitle: 'How to Build a React App from Scratch',
      author: {
        name: 'John Developer',
        avatar: '/api/placeholder/40/40'
      },
      text: 'Great tutorial!',
      status: 'new',
      createdAt: '2024-01-16T08:30:00Z',
      likes: 12,
      replies: 2
    }
  ],
  mockVideos: [
    {
      id: '1',
      title: 'How to Build a React App from Scratch',
      description: 'Complete tutorial on building a modern React application.',
      thumbnail: '/api/placeholder/320/180',
      duration: '15:30',
      status: 'published',
      views: 15420,
      likes: 892,
      uploadedAt: '2024-01-15T10:30:00Z',
      visibility: 'public',
      tags: ['react', 'typescript', 'tutorial']
    }
  ]
}));

describe('Studio Dashboard Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(async () => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock useAuth hook
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
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

  it('renders dashboard page with title', async () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Overview of your channel performance and recent activity.')).toBeInTheDocument();
  });

  it('renders statistics cards', async () => {
    render(<DashboardPage />);
    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('Likes')).toBeInTheDocument();
    expect(screen.getByText('Subscribers')).toBeInTheDocument();
    expect(screen.getByText('Videos')).toBeInTheDocument();
  });

  it('shows statistics values correctly', async () => {
    render(<DashboardPage />);
    expect(screen.getByText('100,000')).toBeInTheDocument(); // views из mockDashboardStats
    expect(screen.getByText('5,000')).toBeInTheDocument(); // likes из mockDashboardStats
  });

  it('renders recent videos section', async () => {
    render(<DashboardPage />);
    // Название видео может встречаться несколько раз
    expect(screen.getAllByText('How to Build a React App from Scratch').length).toBeGreaterThan(0);
  });

  it('renders recent comments section', async () => {
    render(<DashboardPage />);
    expect(screen.getByText('Recent Comments')).toBeInTheDocument();
    expect(screen.getByText('Great tutorial!')).toBeInTheDocument();
  });

  it('shows comment authors', async () => {
    render(<DashboardPage />);
    expect(screen.getByText('John Developer')).toBeInTheDocument();
  });

  it('shows video titles in comments', async () => {
    render(<DashboardPage />);
    // Название видео может встречаться несколько раз
    expect(screen.getAllByText('How to Build a React App from Scratch').length).toBeGreaterThan(0);
  });
}); 