import { render, screen } from '@testing-library/react';
import { AnalyticsPage } from '@/modules/studio/pages/AnalyticsPage';
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

// Mock the mockAnalytics data
jest.mock('@/lib/mock/studio-data', () => ({
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
  }
}));

describe('Studio Analytics Page', () => {
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
      isLoggedIn: true,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders analytics page with title', () => {
    render(<AnalyticsPage />);
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Track your channel performance and audience insights.')).toBeInTheDocument();
  });

  it('renders overview statistics', () => {
    render(<AnalyticsPage />);
    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('Subscribers')).toBeInTheDocument();
  });

  it('shows overview values correctly', () => {
    render(<AnalyticsPage />);
    expect(screen.getByText('45,678')).toBeInTheDocument();
    expect(screen.getByText('2,345')).toBeInTheDocument();
  });
}); 