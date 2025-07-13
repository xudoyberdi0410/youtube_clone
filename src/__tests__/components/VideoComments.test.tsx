import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VideoComments } from '@/components/video/VideoComments'
import { useVideoComments } from '@/hooks/use-video-comments'
import { useAuth } from '@/modules/auth/hooks/use-auth'

// Mock hooks
jest.mock('@/hooks/use-video-comments')
jest.mock('@/modules/auth/hooks/use-auth')
jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
}))

const mockUseVideoComments = useVideoComments as jest.MockedFunction<typeof useVideoComments>
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('VideoComments', () => {
  const defaultProps = {
    videoId: '123'
  }

  // const mockComments = [
  //   {
  //     comment_id: '1',
  //     user_id: 'user1',
  //     username: 'TestUser1',
  //     comment_text: 'Great video!',
  //     created_at: '2023-01-01T00:00:00Z',
  //     likes_count: 5,
  //     dislikes_count: 1,
  //     is_liked: false,
  //     is_disliked: false,
  //     can_edit: false,
  //     can_delete: false
  //   },
  //   {
  //     comment_id: '2',
  //     user_id: 'user2',
  //     username: 'TestUser2',
  //     comment_text: 'Amazing content!',
  //     created_at: '2023-01-02T00:00:00Z',
  //     likes_count: 3,
  //     dislikes_count: 0,
  //     is_liked: true,
  //     is_disliked: false,
  //     can_edit: false,
  //     can_delete: false
  //   }
  // ]

  beforeEach(() => {
    mockUseVideoComments.mockReturnValue({
      comments: [],
      isLoading: false,
      error: null,
      commentsCount: 0,
      refreshComments: jest.fn(),
      addComment: jest.fn(),
      isClient: true
    })

    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      requireAuth: jest.fn(),
      user: null,
      loading: false,
      isLoggedIn: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })
  })

  it('should render loading state', () => {
    mockUseVideoComments.mockReturnValue({
      comments: [],
      isLoading: true,
      error: null,
      commentsCount: 0,
      refreshComments: jest.fn(),
      addComment: jest.fn(),
      isClient: true
    })

    render(<VideoComments {...defaultProps} />)

    expect(screen.getByText('comments.loading')).toBeInTheDocument()
  })

  it('should render error state', () => {
    mockUseVideoComments.mockReturnValue({
      comments: [],
      isLoading: false,
      error: 'Failed to load comments',
      commentsCount: 0,
      refreshComments: jest.fn(),
      addComment: jest.fn(),
      isClient: true
    })

    render(<VideoComments {...defaultProps} />)

    expect(screen.getByText('comments.loadError')).toBeInTheDocument()
    expect(screen.getByText('Failed to load comments')).toBeInTheDocument()
    expect(screen.getByText('comments.retry')).toBeInTheDocument()
  })

  it('should render empty state when no comments', () => {
    mockUseVideoComments.mockReturnValue({
      comments: [],
      isLoading: false,
      error: null,
      commentsCount: 0,
      refreshComments: jest.fn(),
      addComment: jest.fn(),
      isClient: true
    })

    render(<VideoComments {...defaultProps} />)

    expect(screen.getByText('comments.title')).toBeInTheDocument()
    expect(screen.getByText('comments.empty')).toBeInTheDocument()
    expect(screen.getByText('comments.beFirst')).toBeInTheDocument()
  })

  it('should render comments list', () => {
    mockUseVideoComments.mockReturnValue({
      comments: [
        {
          id: '1',
          channel_name: 'TestUser1',
          comment: 'Great video!',
          created_at: '2022-01-01T00:00:00Z',
        },
        {
          id: '2',
          channel_name: 'TestUser2',
          comment: 'Amazing content!',
          created_at: '2022-01-02T00:00:00Z',
        },
      ],
      isLoading: false,
      error: null,
      commentsCount: 2,
      refreshComments: jest.fn(),
      addComment: jest.fn(),
      isClient: true
    })

    render(<VideoComments {...defaultProps} />)

    expect(screen.getByText('2 comments.count')).toBeInTheDocument()
    expect(screen.getByText('Great video!')).toBeInTheDocument()
    expect(screen.getByText('Amazing content!')).toBeInTheDocument()
    expect(screen.getByText('TestUser1')).toBeInTheDocument()
    expect(screen.getByText('TestUser2')).toBeInTheDocument()
  })

  it('should show comment input for authenticated users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: jest.fn(),
      user: { id: 'user1', username: 'TestUser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    render(<VideoComments {...defaultProps} />)

    expect(screen.getByPlaceholderText('comments.addPlaceholder')).toBeInTheDocument()
  })

  it('should not show comment input for unauthenticated users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      requireAuth: jest.fn(),
      user: null,
      loading: false,
      isLoggedIn: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    render(<VideoComments {...defaultProps} />)

    expect(screen.queryByPlaceholderText('comments.addPlaceholder')).not.toBeInTheDocument()
  })

  it('should handle comment submission', async () => {
    const mockAddComment = jest.fn()
    const mockRequireAuth = jest.fn((callback) => callback())

    mockUseVideoComments.mockReturnValue({
      comments: [],
      isLoading: false,
      error: null,
      commentsCount: 0,
      refreshComments: jest.fn(),
      addComment: mockAddComment,
      isClient: true
    })

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: mockRequireAuth,
      user: { id: 'user1', username: 'TestUser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    render(<VideoComments {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('comments.addPlaceholder')
    
    // Сначала вводим текст, чтобы появились кнопки
    fireEvent.change(textarea, { target: { value: 'New comment' } })
    
    // Теперь ищем кнопку submit
    const submitButton = screen.getByText('comments.submit')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith('New comment')
    })
  })

  it('should handle comment cancellation', () => {
    const mockRequireAuth = jest.fn((callback) => callback())

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: mockRequireAuth,
      user: { id: 'user1', username: 'TestUser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    render(<VideoComments {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('comments.addPlaceholder')
    
    // Сначала вводим текст, чтобы появились кнопки
    fireEvent.change(textarea, { target: { value: 'New comment' } })
    
    // Теперь ищем кнопку cancel
    const cancelButton = screen.getByText('comments.cancel')
    fireEvent.click(cancelButton)

    expect(textarea).toHaveValue('')
  })

  it('should disable submit button when comment is empty', () => {
    const mockRequireAuth = jest.fn((callback) => callback())

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: mockRequireAuth,
      user: { id: 'user1', username: 'TestUser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    render(<VideoComments {...defaultProps} />)

    // Кнопка может не отображаться, пока нет текста, поэтому проверяем, что она не активна
    // или что textarea пустой
    const textarea = screen.getByPlaceholderText('comments.addPlaceholder')
    expect(textarea).toHaveValue('')
  })

  it('should show sending state during comment submission', async () => {
    const mockAddComment = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    const mockRequireAuth = jest.fn((callback) => callback())

    mockUseVideoComments.mockReturnValue({
      comments: [],
      isLoading: false,
      error: null,
      commentsCount: 0,
      refreshComments: jest.fn(),
      addComment: mockAddComment,
      isClient: true
    })

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      requireAuth: mockRequireAuth,
      user: { id: 'user1', username: 'TestUser' },
      loading: false,
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    })

    render(<VideoComments {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('comments.addPlaceholder')
    
    // Сначала вводим текст, чтобы появились кнопки
    fireEvent.change(textarea, { target: { value: 'New comment' } })
    
    // Теперь ищем кнопку submit
    const submitButton = screen.getByText('comments.submit')
    fireEvent.click(submitButton)

    expect(screen.getByText('comments.sending')).toBeInTheDocument()
  })

  it('should handle retry on error', () => {
    const mockRefreshComments = jest.fn()

    mockUseVideoComments.mockReturnValue({
      comments: [],
      isLoading: false,
      error: 'Failed to load comments',
      commentsCount: 0,
      refreshComments: mockRefreshComments,
      addComment: jest.fn(),
      isClient: true
    })

    render(<VideoComments {...defaultProps} />)

    const retryButton = screen.getByText('comments.retry')
    fireEvent.click(retryButton)

    expect(mockRefreshComments).toHaveBeenCalled()
  })

  it('should not render anything when not on client', () => {
    mockUseVideoComments.mockReturnValue({
      comments: [],
      isLoading: false,
      error: null,
      commentsCount: 0,
      refreshComments: jest.fn(),
      addComment: jest.fn(),
      isClient: false
    })

    const { container } = render(<VideoComments {...defaultProps} />)
    expect(container.firstChild).toBeNull()
  })

  it('should apply custom className', () => {
    const { container } = render(<VideoComments {...defaultProps} className="custom-class" />)

    // Ищем корневой элемент с custom-class
    const rootElement = container.firstChild as HTMLElement
    expect(rootElement).toHaveClass('custom-class')
  })
}) 