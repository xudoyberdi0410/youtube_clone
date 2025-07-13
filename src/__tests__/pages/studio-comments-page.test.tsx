import { render, screen } from '@testing-library/react';
import { CommentsPage } from '@/modules/studio/pages/CommentsPage';
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

// Mock the mockComments data
jest.mock('@/lib/mock/studio-data', () => ({
  mockComments: [
    {
      id: '1',
      videoId: '1',
      videoTitle: 'How to Build a React App from Scratch',
      author: {
        name: 'John Developer',
        avatar: '/api/placeholder/40/40'
      },
      text: 'Great tutorial! Really helped me understand React better. Can you make a follow-up video about state management?',
      status: 'new',
      createdAt: '2024-01-16T08:30:00Z',
      likes: 12,
      replies: 2
    },
    {
      id: '2',
      videoId: '1',
      videoTitle: 'How to Build a React App from Scratch',
      author: {
        name: 'Sarah Coder',
        avatar: '/api/placeholder/40/40'
      },
      text: 'The TypeScript integration part was confusing. Could you explain it more slowly?',
      status: 'new',
      createdAt: '2024-01-16T10:15:00Z',
      likes: 5,
      replies: 1
    }
  ]
}));

describe('Studio Comments Page', () => {
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

  it('renders comments page with title', async () => {
    render(<CommentsPage />);
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('Manage comments on your videos. Review, approve, hide, or delete comments.')).toBeInTheDocument();
  });

  it('renders comments table with correct columns', () => {
    render(<CommentsPage />);
    expect(screen.getByText('Comment')).toBeInTheDocument();
    expect(screen.getByText('Video')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders comment authors and texts', () => {
    render(<CommentsPage />);
    // Используем реальные имена из mockComments
    expect(screen.getByText('John Developer')).toBeInTheDocument();
    expect(screen.getByText('Sarah Coder')).toBeInTheDocument();
    // Проверяем наличие текста комментария
    expect(screen.getByText(/Great tutorial!/)).toBeInTheDocument();
  });

  it('renders video titles for comments', () => {
    render(<CommentsPage />);
    // Проверяем наличие названий видео из mockComments (может быть несколько)
    expect(screen.getAllByText('How to Build a React App from Scratch').length).toBeGreaterThan(0);
  });

  it('renders status badges', () => {
    render(<CommentsPage />);
    expect(screen.getAllByText(/Approved|New|Hidden/i).length).toBeGreaterThan(0);
  });

  it('renders date column with relative time', () => {
    render(<CommentsPage />);
    expect(screen.getAllByText(/ago/).length).toBeGreaterThan(0);
  });

  it('renders actions menu for each comment', () => {
    render(<CommentsPage />);
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('shows empty state when no comments found', async () => {
    // Мокаем пустой массив комментариев
    const { mockComments } = await import('@/lib/mock/studio-data');
    mockComments.length = 0; // Очищаем массив
    
    render(<CommentsPage />);
    // Проверяем реальный текст из локализации
    expect(screen.getByText('No comments yet')).toBeInTheDocument();
    expect(screen.getByText('No comments have been made on your videos yet.')).toBeInTheDocument();
  });
}); 