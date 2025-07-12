import { render, screen, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchPage from '@/app/search/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('Search Page', () => {
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
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?q=test'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders search results for videos', async () => {
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('Mock Video 1')).toBeInTheDocument();
      expect(screen.getByText('Mock Video 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Mock Channel 1')).toBeInTheDocument();
    expect(screen.getByText('Mock Channel 2')).toBeInTheDocument();
  });

  it('displays search query in results', async () => {
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('Search Results for: test')).toBeInTheDocument();
    });
  });

  it('shows video information correctly', async () => {
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('12,345 views')).toBeInTheDocument();
      expect(screen.getByText('67,890 views')).toBeInTheDocument();
    });
  });

  it('handles missing search query gracefully', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));

    render(<SearchPage />);

    expect(screen.getByText(/Search Results for:/)).toBeInTheDocument();
  });

  it('renders channel search results', async () => {
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('Mock Channel 1')).toBeInTheDocument();
      expect(screen.getByText('Mock Channel 2')).toBeInTheDocument();
    });
  });

  it('shows video descriptions', async () => {
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('This is a mock video result.')).toBeInTheDocument();
      expect(screen.getByText('Another mock video result.')).toBeInTheDocument();
    });
  });

  it('shows video durations', async () => {
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('12:34')).toBeInTheDocument();
      expect(screen.getByText('8:20')).toBeInTheDocument();
    });
  });
}); 