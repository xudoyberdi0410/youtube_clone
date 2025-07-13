import { render, screen, waitFor } from '@testing-library/react';
import { UploadPage } from '@/modules/studio/pages/UploadPage';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock i18n
jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
}));

describe('Studio Upload Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload page with title', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('studio.upload')).toBeInTheDocument();
    });
  });

  it('renders upload description', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('Upload a video and add details to share with your audience.')).toBeInTheDocument();
    });
  });

  it('renders file upload area', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('studio.upload.dropzone')).toBeInTheDocument();
      expect(screen.getByText('studio.upload.selectFile')).toBeInTheDocument();
    });
  });

  it('renders supported formats information', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('studio.upload.supportedFormats')).toBeInTheDocument();
    });
  });

  it('renders save draft button', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('studio.upload.saveDraft')).toBeInTheDocument();
    });
  });

  it('renders publish button', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('studio.upload.publish')).toBeInTheDocument();
    });
  });

  it('shows validation message when no file selected', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('studio.upload.pleaseSelectVideo')).toBeInTheDocument();
    });
  });

  it('renders title field', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getAllByText('studio.upload.title')).toHaveLength(2);
      expect(screen.getByPlaceholderText('studio.upload.enterTitle')).toBeInTheDocument();
    });
  });

  it('renders description field', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getAllByText('studio.upload.description')).toHaveLength(2);
    });
  });

  it('renders character count', async () => {
    render(<UploadPage />);

    await waitFor(() => {
      expect(screen.getByText('0/100 characters')).toBeInTheDocument();
    });
  });
}); 