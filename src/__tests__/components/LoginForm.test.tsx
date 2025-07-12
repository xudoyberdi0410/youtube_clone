import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/modules/auth/ui/components/login-form'
import { loginUser } from '@/modules/auth/lib/auth-utils'
import { useRouter } from 'next/navigation'

// Mock dependencies
jest.mock('@/modules/auth/lib/auth-utils')
jest.mock('next/navigation')
jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
}))

const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('LoginForm', () => {
  const mockPush = jest.fn()
  const mockReplace = jest.fn()

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    })

    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })

    // Mock document.referrer
    Object.defineProperty(document, 'referrer', {
      value: 'https://example.com/previous-page',
      writable: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render login form with all elements', () => {
    render(<LoginForm />)

    expect(screen.getByText('auth.loginTitle')).toBeInTheDocument()
    expect(screen.getByText('auth.loginDescription')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.email')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'auth.loginBtn' })).toBeInTheDocument()
    expect(screen.getByText('auth.noAccount')).toBeInTheDocument()
    expect(screen.getByText('auth.signupLink')).toBeInTheDocument()
  })

  it('should handle form submission successfully', async () => {
    mockLoginUser.mockResolvedValue(undefined)
    ;(window.sessionStorage.getItem as jest.Mock).mockReturnValue('/dashboard')

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('auth.email')
    const passwordInput = screen.getByLabelText('auth.password')
    const submitButton = screen.getByRole('button', { name: 'auth.loginBtn' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password123'
      })
    })

    expect(mockReplace).toHaveBeenCalledWith('/dashboard')
  })

  it('should handle form submission error', async () => {
    const errorMessage = 'Invalid credentials'
    mockLoginUser.mockRejectedValue(new Error(errorMessage))

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('auth.email')
    const passwordInput = screen.getByLabelText('auth.password')
    const submitButton = screen.getByRole('button', { name: 'auth.loginBtn' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('should show loading state during submission', async () => {
    mockLoginUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('auth.email')
    const passwordInput = screen.getByLabelText('auth.password')
    const submitButton = screen.getByRole('button', { name: 'auth.loginBtn' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    expect(screen.getByText('auth.loggingIn')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('should navigate to home page when no returnTo is set', async () => {
    mockLoginUser.mockResolvedValue(undefined)
    ;(window.sessionStorage.getItem as jest.Mock).mockReturnValue(null)

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('auth.email')
    const passwordInput = screen.getByLabelText('auth.password')
    const submitButton = screen.getByRole('button', { name: 'auth.loginBtn' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/')
    })
  })

  it('should save returnTo from document.referrer on mount', () => {
    render(<LoginForm />)

    expect(window.sessionStorage.setItem).toHaveBeenCalledWith('returnTo', 'https://example.com/previous-page')
  })

  it('should not save returnTo if referrer is auth page', () => {
    Object.defineProperty(document, 'referrer', {
      value: 'https://example.com/auth/login',
      writable: true,
    })

    render(<LoginForm />)

    expect(window.sessionStorage.setItem).not.toHaveBeenCalled()
  })

  it('should require email and password fields', () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('auth.email')
    const passwordInput = screen.getByLabelText('auth.password')

    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })

  it('should have correct input types', () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('auth.email')
    const passwordInput = screen.getByLabelText('auth.password')

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should clear error on new submission', async () => {
    const errorMessage = 'Invalid credentials'
    mockLoginUser
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce(undefined)

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('auth.email')
    const passwordInput = screen.getByLabelText('auth.password')
    const submitButton = screen.getByRole('button', { name: 'auth.loginBtn' })

    // First submission - error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    // Second submission - success
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument()
    })
  })

  it('should apply custom className', () => {
    render(<LoginForm className="custom-class" />)
    // Ищем div с этим классом среди всех div
    const container = Array.from(document.querySelectorAll('div')).find(div => div.classList.contains('custom-class'))
    expect(container).toBeInTheDocument()
  })

  it('should handle generic error message', async () => {
    mockLoginUser.mockRejectedValue(new Error())

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('auth.email')
    const passwordInput = screen.getByLabelText('auth.password')
    const submitButton = screen.getByRole('button', { name: 'auth.loginBtn' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('auth.error.login')).toBeInTheDocument()
    })
  })

  it('should handle non-Error exceptions', async () => {
    mockLoginUser.mockRejectedValue('String error')

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('auth.email')
    const passwordInput = screen.getByLabelText('auth.password')
    const submitButton = screen.getByRole('button', { name: 'auth.loginBtn' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('auth.error.login')).toBeInTheDocument()
    })
  })
}) 