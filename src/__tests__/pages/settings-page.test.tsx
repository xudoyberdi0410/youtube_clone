import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SettingsPage from '@/app/settings/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useSettings hook
jest.mock('@/modules/settings/hooks/use-settings', () => ({
  __esModule: true,
  useSettings: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('@/modules/auth/hooks/use-auth', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

// Mock i18n
jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
}));

describe('Settings Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    username: 'testuser',
    avatar: 'user-avatar.jpg',
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock useAuth hook
    const { useAuth } = require('@/modules/auth/hooks/use-auth');
    useAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      error: null,
      isAuthenticated: true,
    });

    // Mock useSettings hook
    const { useSettings } = require('@/modules/settings/hooks/use-settings');
    useSettings.mockReturnValue({
      user: mockUser,
      loading: false,
      formData: {
        username: 'Test User',
        email: 'test@example.com',
        password: '',
        confirmPassword: ''
      },
      saving: false,
      error: null,
      success: null,
      cacheBuster: '?t=1234567890',
      updateFormData: jest.fn(),
      clearMessages: jest.fn(),
      handleSubmit: jest.fn(),
      handleAvatarUpload: jest.fn(),
      handleDeleteAccount: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders settings page with title', async () => {
    render(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('settings.title')).toBeInTheDocument();
    });
  });

  it('renders account tab by default', async () => {
    render(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('settings.accountTab')).toBeInTheDocument();
    });
  });

  it('shows user information in account tab', async () => {
    render(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('settings.accountInfo')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('shows loading state when settings are loading', () => {
    const { useSettings } = require('@/modules/settings/hooks/use-settings');
    useSettings.mockReturnValue({
      user: null,
      loading: true,
      formData: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      saving: false,
      error: null,
      success: null,
      cacheBuster: '',
      updateFormData: jest.fn(),
      clearMessages: jest.fn(),
      handleSubmit: jest.fn(),
      handleAvatarUpload: jest.fn(),
      handleDeleteAccount: jest.fn()
    });

    render(<SettingsPage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('requires authentication to access settings', () => {
    const { useSettings } = require('@/modules/settings/hooks/use-settings');
    useSettings.mockReturnValue({
      user: null,
      loading: false,
      formData: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      saving: false,
      error: null,
      success: null,
      cacheBuster: '',
      updateFormData: jest.fn(),
      clearMessages: jest.fn(),
      handleSubmit: jest.fn(),
      handleAvatarUpload: jest.fn(),
      handleDeleteAccount: jest.fn()
    });

    render(<SettingsPage />);

    expect(screen.queryByText('settings.title')).not.toBeInTheDocument();
  });

  it('shows profile picture section', async () => {
    render(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('settings.profilePicture')).toBeInTheDocument();
    });
  });

  it('shows account info section', async () => {
    render(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('settings.accountInfo')).toBeInTheDocument();
    });
  });

  it('shows danger zone section', async () => {
    render(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('settings.dangerZone')).toBeInTheDocument();
    });
  });

  it('shows delete account button', async () => {
    render(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('settings.deleteAccountBtn')).toBeInTheDocument();
    });
  });

  it('shows save changes button', async () => {
    render(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('settings.saveChanges')).toBeInTheDocument();
    });
  });
}); 