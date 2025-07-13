import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-subscriptions', () => ({
  __esModule: true,
  useSubscriptions: jest.fn(),
}));

jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'subscriptions.title': 'Subscriptions',
      'subscriptions.empty': 'No subscriptions found',
      'subscriptions.emptyHint': 'Subscribe to channels to see them here',
      'subscriptions.browseChannels': 'Browse Channels',
      'subscriptions.loadError': 'Failed to load subscriptions',
      'subscriptions.confirmUnsubscribe': 'Are you sure you want to unsubscribe?',
      'subscriptions.unsubscribeError': 'Failed to unsubscribe',
      'subscriptions.unsubscribe': 'Unsubscribe',
      'subscriptions.unknown': 'Unknown Channel',
      'channel.subscribers': 'subscribers',
    };
    return translations[key] || key;
  }),
}));

jest.mock('@/lib/api-client', () => ({
  ApiClient: {
    getInstance: jest.fn(() => ({
      unsubscribe: jest.fn(),
      getSubscriptions: jest.fn(),
    })),
  },
}));

jest.mock('@/components/youtube-icons', () => ({
  SubscriptionsIcon: () => <div data-testid="subscriptions-icon">SubscriptionsIcon</div>,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div data-testid="card-content" {...props}>{children}</div>,
}));

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div data-testid="avatar" {...props}>{children}</div>,
  AvatarImage: ({ ...props }: { [key: string]: unknown }) => <img data-testid="avatar-image" {...props} />,
  AvatarFallback: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div data-testid="avatar-fallback" {...props}>{children}</div>,
}));

jest.mock('@/components/video/UniversalVideoCard', () => ({
  __esModule: true,
  default: ({ video }: { video: { title: string; preview: string } }) => (
    <div data-testid="universal-video-card">
      <h3>{video.title}</h3>
      <div data-testid="video-preview" data-src={video.preview} data-alt={`Preview for ${video.title}`} />
    </div>
  ),
}));

import SubscriptionsPage from '@/modules/feed/subscriptions/page';

describe('Feed Subscriptions Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockSubscriptions = [
    {
      id: 1,
      channel_name: 'Test Channel 1',
      username: 'testchannel1',
      channel_subscription_amount: 10000,
    },
    {
      id: 2,
      channel_name: 'Test Channel 2',
      username: 'testchannel2',
      channel_subscription_amount: 5000,
    },
  ];

  beforeEach(async () => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: true,
      user: { id: 1, username: 'testuser' },
      loading: false,
      isAuthenticated: true,
      isLoading: false,
    });

    const { useSubscriptions } = await import('@/hooks/use-subscriptions');
    useSubscriptions.mockReturnValue({
      subscriptions: [],
      isLoading: false,
      error: null,
      loadSubscriptions: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(<SubscriptionsPage />)).not.toThrow();
  });

  it('should render subscriptions page with data', () => {
    render(<SubscriptionsPage />);
    expect(screen.getByText('No subscriptions found')).toBeInTheDocument();
    expect(screen.getByText('Subscribe to channels to see them here')).toBeInTheDocument();
    expect(screen.getByText('Browse Channels')).toBeInTheDocument();
  });

  it('should render subscriptions with data', async () => {
    const { useSubscriptions } = await import('@/hooks/use-subscriptions');
    useSubscriptions.mockReturnValue({
      subscriptions: mockSubscriptions,
      isLoading: false,
      error: null,
      loadSubscriptions: jest.fn(),
    });

    render(<SubscriptionsPage />);
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('Test Channel 1')).toBeInTheDocument();
    expect(screen.getByText('Test Channel 2')).toBeInTheDocument();
    expect(screen.getByText('@testchannel1')).toBeInTheDocument();
    expect(screen.getByText('@testchannel2')).toBeInTheDocument();
  });

  it('should show loading state', async () => {
    const { useSubscriptions } = await import('@/hooks/use-subscriptions');
    useSubscriptions.mockReturnValue({
      subscriptions: [],
      isLoading: true,
      error: null,
      loadSubscriptions: jest.fn(),
    });

    render(<SubscriptionsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show error state', async () => {
    const { useSubscriptions } = await import('@/hooks/use-subscriptions');
    useSubscriptions.mockReturnValue({
      subscriptions: [],
      isLoading: false,
      error: 'Failed to load subscriptions',
      loadSubscriptions: jest.fn(),
    });

    render(<SubscriptionsPage />);
    expect(screen.getByText('Failed to load subscriptions')).toBeInTheDocument();
  });

  it('should show empty state when no subscriptions', async () => {
    const { useSubscriptions } = await import('@/hooks/use-subscriptions');
    useSubscriptions.mockReturnValue({
      subscriptions: [],
      isLoading: false,
      error: null,
      loadSubscriptions: jest.fn(),
    });

    render(<SubscriptionsPage />);
    expect(screen.getByText('No subscriptions found')).toBeInTheDocument();
    expect(screen.getByText('Subscribe to channels to see them here')).toBeInTheDocument();
    expect(screen.getByText('Browse Channels')).toBeInTheDocument();
  });

  it('should show auth dialog when not logged in', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: false,
      user: null,
      loading: false,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<SubscriptionsPage />);
    // AuthRequiredDialog should be rendered when not logged in
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should show loading when auth is loading', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      isLoggedIn: false,
      user: null,
      loading: true,
      isAuthenticated: false,
      isLoading: true,
    });

    render(<SubscriptionsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles missing channel name', async () => {
    const subscriptionsWithMissingName = [
      {
        id: 1,
        channel_name: null,
        channel_profile_image: 'avatar.jpg',
        username: 'testchannel',
        channel_subscription_amount: 1000,
      },
    ];

    const { useSubscriptions } = await import('@/hooks/use-subscriptions');
    useSubscriptions.mockReturnValue({
      subscriptions: subscriptionsWithMissingName,
      isLoading: false,
      error: null,
      loadSubscriptions: jest.fn(),
    });

    render(<SubscriptionsPage />);

    await waitFor(() => {
      expect(screen.getByText('Unknown Channel')).toBeInTheDocument();
    });
  });
}); 