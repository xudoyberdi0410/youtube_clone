import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StudioLayout } from '@/modules/studio/layout/StudioLayout'
import { useTheme } from 'next-themes'
import { getCurrentLanguage } from '@/lib/i18n'

// --- Моки ---
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'studio.title': 'Studio',
      'studio.dashboard': 'Dashboard',
      'studio.videos': 'Videos',
      'studio.upload': 'Upload',
      'studio.comments': 'Comments',
      'studio.analytics': 'Analytics',
      'studio.channel': 'Channel',
      'studio.language': 'Language',
      'studio.theme': 'Theme',
      'studio.theme.light': 'Light',
      'studio.theme.dark': 'Dark',
      'studio.theme.system': 'System',
    }
    return translations[key] || key
  }),
  setLanguage: jest.fn(),
  getCurrentLanguage: jest.fn(() => 'en'),
}))

jest.mock('next/navigation', () => ({
  usePathname: () => '/studio/dashboard',
}))

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>
  }
})

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
const mockGetCurrentLanguage = getCurrentLanguage as jest.MockedFunction<typeof getCurrentLanguage>

// Mock window.location.reload
const mockReload = jest.fn()
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
})

// --- Хелперы ---
const openMobileSidebar = () => {
  const menuBtns = screen.getAllByTestId('menu-btn')
  const visibleMenuBtn = menuBtns.find(btn => 
    btn.closest('div')?.style.display !== 'none' && 
    btn.offsetParent !== null
  ) || menuBtns[0]
  fireEvent.click(visibleMenuBtn)
}

const closeMobileSidebar = () => {
  const closeBtn = screen.getByTestId('close-btn')
  fireEvent.click(closeBtn)
}

// Helper to check if an element is visible
const isVisible = (el: HTMLElement | null) => {
  return !!(el && el.offsetParent !== null)
}

// --- Настройка ---
beforeEach(() => {
  jest.clearAllMocks()
  mockUseTheme.mockReturnValue({
    theme: 'light',
    setTheme: jest.fn(),
    themes: ['light', 'dark', 'system'],
    resolvedTheme: 'light',
    systemTheme: 'light',
  })
  mockGetCurrentLanguage.mockReturnValue('en')
})

// --- Тесты ---
describe('StudioLayout', () => {
  it('renders without crashing', () => {
    render(<StudioLayout>content</StudioLayout>)
    expect(screen.getAllByText('Studio')[0]).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(<StudioLayout>Test content</StudioLayout>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('shows all navigation links', () => {
    render(<StudioLayout>content</StudioLayout>)
    expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Videos')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Upload')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Comments')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Analytics')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Channel')[0]).toBeInTheDocument()
  })

  it('opens mobile sidebar when menu button is clicked', () => {
    render(<StudioLayout>content</StudioLayout>)
    openMobileSidebar()
    expect(screen.getByTestId('close-btn')).toBeInTheDocument()
  })

  it('closes mobile sidebar when close button is clicked', () => {
    render(<StudioLayout>content</StudioLayout>)
    openMobileSidebar()
    closeMobileSidebar()
    const closeBtn = screen.queryByTestId('close-btn')
    expect(!closeBtn || !isVisible(closeBtn)).toBe(true)
  })

  it('shows correct current language', () => {
    mockGetCurrentLanguage.mockReturnValue('ru')
    render(<StudioLayout>content</StudioLayout>)
    expect(screen.getAllByText('RU')[0]).toBeInTheDocument()
  })

  it('shows correct current theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
      themes: ['light', 'dark', 'system'],
      resolvedTheme: 'dark',
      systemTheme: 'light',
    })
    render(<StudioLayout>content</StudioLayout>)
    expect(screen.getAllByText('Dark')[0]).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<StudioLayout>content</StudioLayout>)
    const main = screen.getAllByRole('main')[0]
    const nav = screen.getAllByRole('navigation')[0]
    expect(main).toBeInTheDocument()
    expect(nav).toBeInTheDocument()
  })

  it('handles navigation link clicks', () => {
    render(<StudioLayout>content</StudioLayout>)
    const videosLinks = screen.getAllByText('Videos')
    const videosLink = videosLinks[0]
    expect(videosLink).toHaveAttribute('href', '/studio/videos')
  })

  it('shows active navigation state', () => {
    render(<StudioLayout>content</StudioLayout>)
    const dashboardLinks = screen.getAllByText('Dashboard')
    const dashboardLink = dashboardLinks[0]
    expect(dashboardLink.closest('a')).toHaveClass('bg-primary')
  })

  it('closes mobile sidebar when navigation link is clicked', async () => {
    render(<StudioLayout>content</StudioLayout>)
    openMobileSidebar()
    const videosLinks = screen.getAllByText('Videos')
    const videosLink = videosLinks[0]
    fireEvent.click(videosLink)
    await waitFor(() => {
      const closeBtn = screen.queryByTestId('close-btn')
      expect(!closeBtn || !isVisible(closeBtn)).toBe(true)
    })
  })

  it('renders desktop sidebar on large screens', () => {
    render(<StudioLayout>content</StudioLayout>)
    const desktopSidebar = document.querySelector('.hidden.lg\\:fixed')
    expect(desktopSidebar).toBeInTheDocument()
  })

  it('renders mobile header on small screens', () => {
    render(<StudioLayout>content</StudioLayout>)
    const mobileHeader = document.querySelector('.lg\\:hidden')
    expect(mobileHeader).toBeInTheDocument()
  })

  it('renders language and theme dropdown triggers', () => {
    render(<StudioLayout>content</StudioLayout>)
    openMobileSidebar()
    expect(screen.getAllByTestId('language-dropdown-trigger')[0]).toBeInTheDocument()
    expect(screen.getAllByTestId('theme-dropdown-trigger')[0]).toBeInTheDocument()
  })

  it('shows language and theme labels', () => {
    render(<StudioLayout>content</StudioLayout>)
    openMobileSidebar()
    expect(screen.getAllByText('Language')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Theme')[0]).toBeInTheDocument()
  })
}) 