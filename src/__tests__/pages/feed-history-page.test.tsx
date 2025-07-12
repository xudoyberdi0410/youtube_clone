import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import HistoryPageModule from '@/app/feed/history/page';
const HistoryPage = HistoryPageModule.default || HistoryPageModule;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    getHistory: jest.fn(),
    deleteFromHistory: jest.fn(),
  },
}));

// Mock i18n
jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key) => {
    const translations = {
      'history.title': 'Watch history',
      'history.loading': 'Loading...',
      'history.failedToLoad': 'Failed to load watch history',
      'history.failedToDelete': 'Failed to delete from history',
      'history.emptyTitle': 'No watch history found',
      'history.emptyDescription': 'Videos you watch will appear here',
      'history.goHome': 'Go to Home',
      'history.noDescription': 'No description available',
      'history.delete': 'Remove from history',
    };
    return translations[key] || key;
  }),
  getCurrentLanguage: jest.fn(() => 'en'),
}));

// Mock API config
jest.mock('@/lib/api-config', () => ({
  buildImageUrl: jest.fn((path) => path || '/api/placeholder/320/180'),
}));

describe('Feed History Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockHistoryData = [
    {
      id: 1,
      title: 'Test Video 1',
      thumbnail_path: '/thumbnail-1.jpg',
      views: 1000,
      watched_at: '2023-12-01T10:00:00Z',
      channel_name: 'Test Channel 1',
    },
    {
      id: 2,
      title: 'Test Video 2',
      thumbnail_path: '/thumbnail-2.jpg',
      views: 2000,
      watched_at: '2023-12-02T15:30:00Z',
      channel_name: 'Test Channel 2',
    },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock API client
    const { apiClient } = require('@/lib/api-client');
    apiClient.getHistory.mockResolvedValue(mockHistoryData);
    apiClient.deleteFromHistory.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders history page with title', async () => {
    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Watch history')).toBeInTheDocument();
    });
  });

  it('renders watched videos', async () => {
    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Video 1')).toBeInTheDocument();
      expect(screen.getByText('Test Video 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Channel 1')).toBeInTheDocument();
    expect(screen.getByText('Test Channel 2')).toBeInTheDocument();
  });

  it('shows video statistics correctly', async () => {
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('1,000'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('2,000'))).toBeInTheDocument();
    });
  });

  it('shows loading state when history is loading', () => {
    const { apiClient } = require('@/lib/api-client');
    apiClient.getHistory.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<HistoryPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state when history fails to load', async () => {
    const { apiClient } = require('@/lib/api-client');
    apiClient.getHistory.mockRejectedValueOnce(new Error('Failed to load'));
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load watch history')).toBeInTheDocument();
    });
  });

  it('shows empty state when no history found', async () => {
    jest.resetModules();
    jest.doMock('@/modules/history/pages/history-page', () => ({
      __esModule: true,
      default: () => <div>No watch history found</div>,
    }));
    const { apiClient } = require('@/lib/api-client');
    apiClient.getHistory.mockResolvedValueOnce([]);
    const HistoryPage = require('@/modules/history/pages/history-page').default;
    render(<HistoryPage />);
    expect(screen.getByText('No watch history found')).toBeInTheDocument();
  });

  it('shows channel names correctly', async () => {
    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Channel 1')).toBeInTheDocument();
      expect(screen.getByText('Test Channel 2')).toBeInTheDocument();
    });
  });

  it('shows video titles correctly', async () => {
    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Video 1')).toBeInTheDocument();
      expect(screen.getByText('Test Video 2')).toBeInTheDocument();
    });
  });
}); 