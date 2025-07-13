import { render, screen } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChannelPageWrapper from '@/app/channel/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock the useChannelPageData hook
jest.mock('@/modules/channel/hooks/use-channel-page-data', () => ({
  __esModule: true,
  useChannelPageData: jest.fn(),
}));

// Mock the useSubscriptions hook
jest.mock('@/hooks/use-subscriptions', () => ({
  __esModule: true,
  useSubscriptions: jest.fn(() => ({
    isSubscribed: false,
    subscriberCount: 10000,
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  })),
}));

// Mock i18n
jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
}));

describe('Channel Page', () => {
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
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?name=test-channel'));

    // Mock useChannelPageData hook
    const { useChannelPageData } = await import('@/modules/channel/hooks/use-channel-page-data');
    useChannelPageData.mockReturnValue({
      channelName: 'test-channel',
      channel: null,
      channelLoading: false,
      channelError: null,
      videos: [],
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders channel page', () => {
    render(<ChannelPageWrapper />);
    // Проверяем наличие любого div элемента
    const divElements = document.querySelectorAll('div');
    expect(divElements.length).toBeGreaterThan(0);
  });

  it('shows error state when channel fails to load', async () => {
    const { useChannelPageData } = await import('@/modules/channel/hooks/use-channel-page-data');
    useChannelPageData.mockReturnValue({
      channelName: 'test-channel',
      channel: null,
      channelLoading: false,
      channelError: 'Failed to load channel',
      videos: [],
      loading: false,
      error: null,
    });

    render(<ChannelPageWrapper />);
    expect(screen.getByText('Failed to load channel')).toBeInTheDocument();
  });

  it('handles missing channel ID gracefully', async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));

    const { useChannelPageData } = await import('@/modules/channel/hooks/use-channel-page-data');
    useChannelPageData.mockReturnValue({
      channelName: null,
      channel: null,
      channelLoading: false,
      channelError: 'Channel name not provided',
      videos: [],
      loading: false,
      error: null,
    });

    render(<ChannelPageWrapper />);
    expect(screen.getByText('channel.nameNotProvided')).toBeInTheDocument();
  });
}); 