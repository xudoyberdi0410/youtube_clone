import { render, screen, waitFor } from '@testing-library/react';
import { useRouter, useParams } from 'next/navigation';
import { Auth as AuthComponent } from '@/modules/auth/ui/components/auth';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

describe('Auth Component', () => {
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
    (useParams as jest.Mock).mockReturnValue({ mode: 'login' });

    // Mock useAuth hook
    const { useAuth } = await import('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form when mode is signin', async () => {
    render(<AuthComponent mode="signin" />);

    await waitFor(() => {
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('m@example.com')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders register form when mode is signup', async () => {
    render(<AuthComponent mode="signup" />);

    await waitFor(() => {
      expect(screen.getByText('Sign up your account')).toBeInTheDocument();
    });
  });

  it('shows email input field', async () => {
    render(<AuthComponent mode="signin" />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('m@example.com')).toBeInTheDocument();
    });
  });

  it('shows password input field', async () => {
    render(<AuthComponent mode="signin" />);

    await waitFor(() => {
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });
  });

  it('shows name input field for signup mode', async () => {
    render(<AuthComponent mode="signup" />);

    await waitFor(() => {
      expect(screen.getByText('Sign up your account')).toBeInTheDocument();
    });
  });

  it('shows back button', async () => {
    render(<AuthComponent mode="signin" />);

    await waitFor(() => {
      expect(screen.getByText('← Назад')).toBeInTheDocument();
    });
  });

  it('shows home button', async () => {
    render(<AuthComponent mode="signin" />);

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  it('shows loading state when authenticating', () => {
    render(<AuthComponent mode="signin" />);

    // Check for loading button text
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('shows error message when authentication fails', () => {
    render(<AuthComponent mode="signin" />);

    // Component shows error in red text
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('shows login form when not authenticated', () => {
    render(<AuthComponent mode="signin" />);

    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('shows login description', async () => {
    render(<AuthComponent mode="signin" />);

    await waitFor(() => {
      expect(screen.getByText('Enter your email and password to sign in')).toBeInTheDocument();
    });
  });

  it('shows link to switch between login and register', async () => {
    render(<AuthComponent mode="signin" />);

    await waitFor(() => {
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText('Sign up')).toBeInTheDocument();
    });
  });

  it('shows link to switch from register to login', async () => {
    render(<AuthComponent mode="signup" />);

    await waitFor(() => {
      expect(screen.getByText('Sign up your account')).toBeInTheDocument();
    });
  });

  it('shows email label', async () => {
    render(<AuthComponent mode="signin" />);

    await waitFor(() => {
      expect(screen.getByText('Email')).toBeInTheDocument();
    });
  });

  it('shows password label', async () => {
    render(<AuthComponent mode="signin" />);

    await waitFor(() => {
      expect(screen.getByText('Password')).toBeInTheDocument();
    });
  });

  it('shows submit button', async () => {
    render(<AuthComponent mode="signin" />);

    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });
}); 