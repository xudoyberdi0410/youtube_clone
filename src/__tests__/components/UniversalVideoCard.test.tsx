import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { UniversalVideoCard } from '@/components/video/UniversalVideoCard'
import { useVideoPreview } from '@/hooks/use-video-preview'
import { useInstantPlay } from '@/hooks/use-instant-play'

// Mock hooks
jest.mock('@/hooks/use-video-preview')
jest.mock('@/hooks/use-instant-play')
jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
  getCurrentLanguage: () => 'en'
}))

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // Удаляем неиспользуемые переменные, чтобы не было ошибок линтера
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, priority, sizes, quality, placeholder, blurDataURL, unoptimized, onLoad, onError, loading, ...imgProps } = props as Record<string, unknown>
    return <img src={src} alt={alt as string} {...imgProps} />
  },
}))

// Mock Avatar component
jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
  AvatarImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock Badge component
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) => (
    <span className={`badge ${variant ?? ''} ${className ?? ''}`}>{children}</span>
  )
}))

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
    <button onClick={onClick} className={className} {...props}>{children}</button>
  )
}))

// Mock DropdownMenu components
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
    if (asChild) return children
    return <button>{children}</button>
  },
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick, asChild }: { children: React.ReactNode; onClick?: () => void; asChild?: boolean }) => {
    if (asChild) return children
    return <button onClick={onClick}>{children}</button>
  }
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Volume2: () => <span>Volume2</span>,
  VolumeX: () => <span>VolumeX</span>,
  MoreVertical: () => <span>MoreVertical</span>
}))

// Mock VerifiedIcon
jest.mock('@/components/youtube-icons', () => ({
  VerifiedIcon: () => <svg data-testid="verified-icon" />
}))

const mockUseVideoPreview = useVideoPreview as jest.MockedFunction<typeof useVideoPreview>
const mockUseInstantPlay = useInstantPlay as jest.MockedFunction<typeof useInstantPlay>

describe('UniversalVideoCard', () => {
  const defaultProps = {
    id: '123',
    title: 'Test Video Title',
    preview: 'https://example.com/thumbnail.jpg',
    views: 1000,
    channel: {
      id: 'channel1',
      name: 'Test Channel',
      avatarUrl: 'https://example.com/avatar.jpg',
      isVerified: false
    },
    uploadedAt: '2023-01-01T00:00:00Z',
    isLive: false,
    videoUrl: 'https://example.com/video.mp4',
    duration: '2:05'
  }

  beforeEach(() => {
    mockUseVideoPreview.mockReturnValue({
      videoRef: { current: null },
      isPreviewing: false,
      isLoaded: false,
      currentTime: 0,
      duration: 120,
      isMuted: true,
      handleMouseEnter: jest.fn(),
      handleMouseLeave: jest.fn(),
      handleTimeUpdate: jest.fn(),
      handleLoadedMetadata: jest.fn(),
      handleSeek: jest.fn(),
      toggleMute: jest.fn(),
      startPreview: jest.fn(),
      stopPreview: jest.fn(),
    })

    mockUseInstantPlay.mockReturnValue({
      navigateToWatch: jest.fn(),
    })
  })

  it('should render video card with all props', () => {
    render(<UniversalVideoCard {...defaultProps} />)
    expect(screen.getByText('Test Video Title')).toBeInTheDocument()
    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })

  it('should render without optional props', () => {
    const minimalProps = {
      id: '123',
      title: 'Test Video',
      preview: 'https://example.com/thumbnail.jpg',
      views: 0,
      channel: {
        avatarUrl: '',
        id: 'channel1',
        name: 'Test Channel',
        isVerified: false
      },
      uploadedAt: '2023-01-01T00:00:00Z',
      isLive: false,
      duration: '1:30'
    }

    render(<UniversalVideoCard {...minimalProps} />)
    expect(screen.getByText('Test Video')).toBeInTheDocument()
    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })

  it('should handle card click and navigate to watch page', () => {
    const mockNavigateToWatch = jest.fn()
    mockUseInstantPlay.mockReturnValue({
      navigateToWatch: mockNavigateToWatch,
    })

    render(<UniversalVideoCard {...defaultProps} />)
    const card = screen.getByText('Test Video Title').closest('div')
    fireEvent.click(card!)
    expect(mockNavigateToWatch).toHaveBeenCalled()
  })

  it('should show menu when showMenu is true and menuItems are provided', () => {
    const menuItems = [
      { label: 'Add to Queue', onClick: jest.fn() },
      { label: 'Save to Watch Later', onClick: jest.fn() }
    ]

    render(<UniversalVideoCard {...defaultProps} showMenu={true} menuItems={menuItems} />)
    const menuButton = screen.getByText('MoreVertical').closest('button')
    fireEvent.click(menuButton!)
    expect(screen.getByText('Add to Queue')).toBeInTheDocument()
    expect(screen.getByText('Save to Watch Later')).toBeInTheDocument()
  })

  it('should show delete button when showDelete is true', () => {
    const onDelete = jest.fn()

    render(<UniversalVideoCard {...defaultProps} showDelete={true} onDelete={onDelete} />)
    const deleteButton = screen.getByRole('button')
    fireEvent.click(deleteButton)
    expect(onDelete).toHaveBeenCalled()
  })

  it('should handle mouse enter and leave events', () => {
    const mockHandleMouseEnter = jest.fn()
    const mockHandleMouseLeave = jest.fn()

    mockUseVideoPreview.mockReturnValue({
      videoRef: { current: null },
      isPreviewing: false,
      isLoaded: false,
      currentTime: 0,
      duration: 120,
      isMuted: true,
      handleMouseEnter: mockHandleMouseEnter,
      handleMouseLeave: mockHandleMouseLeave,
      handleTimeUpdate: jest.fn(),
      handleLoadedMetadata: jest.fn(),
      handleSeek: jest.fn(),
      toggleMute: jest.fn(),
      startPreview: jest.fn(),
      stopPreview: jest.fn(),
    })

    render(<UniversalVideoCard {...defaultProps} />)
    const card = screen.getByText('Test Video Title').closest('div')
    
    fireEvent.mouseEnter(card!)
    expect(mockHandleMouseEnter).toHaveBeenCalled()

    fireEvent.mouseLeave(card!)
    expect(mockHandleMouseLeave).toHaveBeenCalled()
  })

  it('should render channel avatar with fallback', () => {
    const propsWithoutAvatar = {
      ...defaultProps,
      channel: {
        ...defaultProps.channel,
        avatarUrl: ''
      }
    }

    render(<UniversalVideoCard {...propsWithoutAvatar} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('should format views correctly', () => {
    const propsWithHighViews = {
      ...defaultProps,
      views: 1500000
    }

    render(<UniversalVideoCard {...propsWithHighViews} />)
    const elementsWithViews = screen.getAllByText((content, node) => 
      node?.textContent?.includes('1.5M') || 
      node?.textContent?.includes('1,500,000') ||
      node?.textContent?.includes('1500000')
    )
    expect(elementsWithViews.length).toBeGreaterThan(0)
  })

  it('should render video element when videoUrl is provided', () => {
    render(<UniversalVideoCard {...defaultProps} />)
    const video = document.querySelector('video')
    expect(video).toBeInTheDocument()
  })

  it('should not render video element when videoUrl is not provided', () => {
    const propsWithoutVideo = {
      ...defaultProps,
      videoUrl: undefined
    }
    render(<UniversalVideoCard {...propsWithoutVideo} />)
    const video = screen.getByText('Test Video Title').closest('div')?.querySelector('video')
    expect(video).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<UniversalVideoCard {...defaultProps} className="custom-class" />)
    const card = screen.getByText('Test Video Title').closest('div')?.parentElement
    expect(card).toHaveClass('custom-class')
  })

  it('should handle menu item with href', () => {
    const menuItems = [
      { label: 'View Channel', href: '/channel/test' }
    ]
    render(<UniversalVideoCard {...defaultProps} showMenu={true} menuItems={menuItems} />)
    const menuButton = screen.getByText('MoreVertical').closest('button')
    fireEvent.click(menuButton!)
    expect(screen.getByText('View Channel')).toBeInTheDocument()
  })
}) 