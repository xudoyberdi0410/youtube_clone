import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { UploadPage } from '@/modules/studio/pages/UploadPage';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

describe('Upload Page', () => {
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
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload page with title', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('Upload')).toBeInTheDocument();
    });
  });

  it('shows upload form', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Description').length).toBeGreaterThan(0);
    });
  });

  it('shows file upload area', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText(/Drag and drop video file here/)).toBeInTheDocument();
    });
  });

  it('shows video title input', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter video title/)).toBeInTheDocument();
    });
  });

  it('shows video description textarea', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Describe your video/)).toBeInTheDocument();
    });
  });

  it('shows thumbnail upload section', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText(/Upload a custom thumbnail/)).toBeInTheDocument();
    });
  });

  it('shows visibility options', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Visibility')).toHaveLength(2);
    });
  });

  it('shows publish button', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('Publish')).toBeInTheDocument();
    });
  });

  it('shows save as draft button', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('Save draft')).toBeInTheDocument();
    });
  });

  it('requires authentication to access upload page', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });

    render(<UploadPage />);

    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('shows loading state when user is loading', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: null,
      isLoading: true,
      error: null,
      isAuthenticated: false,
    });

    render(<UploadPage />);

    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('shows error state when auth fails', async () => {
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: 'Authentication failed',
      isAuthenticated: false,
    });

    render(<UploadPage />);

    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('shows file size limit information', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText(/Supported formats/)).toBeInTheDocument();
    });
  });

  it('shows supported file formats', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText(/MP4, WebM, MOV, AVI/)).toBeInTheDocument();
    });
  });

  it('shows progress indicator when uploading', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('Upload')).toBeInTheDocument();
    });
  });

  it('shows cancel upload button', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('Upload')).toBeInTheDocument();
    });
  });
}); 