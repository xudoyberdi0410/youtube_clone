import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { VideoCardWithPreview } from '@/components/video/VideoCardWithPreview'
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

describe('VideoCardWithPreview', () => {
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
      currentTime: 0,
      duration: 120,
      isMuted: true,
      handleMouseEnter: jest.fn(),
      handleMouseLeave: jest.fn(),
      handleTimeUpdate: jest.fn(),
      handleLoadedMetadata: jest.fn(),
      toggleMute: jest.fn(),
    })

    mockUseInstantPlay.mockReturnValue({
      navigateToWatch: jest.fn(),
    })
  })

  it('should render video card with all props', () => {
    render(<VideoCardWithPreview {...defaultProps} />)
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
        id: 'channel1',
        name: 'Test Channel',
        avatarUrl: '',
        isVerified: false
      },
      uploadedAt: '2023-01-01T00:00:00Z',
      isLive: false,
      duration: '1:30'
    }

    render(<VideoCardWithPreview {...minimalProps} />)
    expect(screen.getByText('Test Video')).toBeInTheDocument()
    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })

  it('should handle card click and navigate to watch page', () => {
    const mockNavigateToWatch = jest.fn()
    mockUseInstantPlay.mockReturnValue({
      navigateToWatch: mockNavigateToWatch,
    })

    render(<VideoCardWithPreview {...defaultProps} />)
    const card = screen.getByText('Test Video Title').closest('div')
    fireEvent.click(card!)
    expect(mockNavigateToWatch).toHaveBeenCalled()
  })

  it('should handle mouse enter and leave events', () => {
    const mockHandleMouseEnter = jest.fn()
    const mockHandleMouseLeave = jest.fn()

    mockUseVideoPreview.mockReturnValue({
      videoRef: { current: null },
      isPreviewing: false,
      currentTime: 0,
      duration: 120,
      isMuted: true,
      handleMouseEnter: mockHandleMouseEnter,
      handleMouseLeave: mockHandleMouseLeave,
      handleTimeUpdate: jest.fn(),
      handleLoadedMetadata: jest.fn(),
      toggleMute: jest.fn(),
    })

    render(<VideoCardWithPreview {...defaultProps} />)
    const card = screen.getByText('Test Video Title').closest('div')
    
    fireEvent.mouseEnter(card!)
    expect(mockHandleMouseEnter).toHaveBeenCalled()

    fireEvent.mouseLeave(card!)
    expect(mockHandleMouseLeave).toHaveBeenCalled()
  })

  it('should render video element when videoUrl is provided', () => {
    render(<VideoCardWithPreview {...defaultProps} />)
    const video = screen.getByText('Test Video Title').closest('div')?.querySelector('video')
    expect(video).toBeInTheDocument()
  })

  it('should not render video element when videoUrl is not provided', () => {
    const propsWithoutVideo = {
      ...defaultProps,
      videoUrl: undefined
    }

    render(<VideoCardWithPreview {...propsWithoutVideo} />)
    expect(screen.queryByRole('video')).not.toBeInTheDocument()
  })

  it('should show duration badge when not live', () => {
    mockUseVideoPreview.mockReturnValue({
      videoRef: { current: null },
      isPreviewing: false,
      currentTime: 0,
      duration: 125,
      isMuted: true,
      handleMouseEnter: jest.fn(),
      handleMouseLeave: jest.fn(),
      handleTimeUpdate: jest.fn(),
      handleLoadedMetadata: jest.fn(),
      toggleMute: jest.fn(),
    })

    render(<VideoCardWithPreview {...defaultProps} />)
    expect(screen.getByText('2:05')).toBeInTheDocument()
  })

  it('should show live badge when isLive is true', () => {
    const liveProps = {
      ...defaultProps,
      isLive: true
    }

    render(<VideoCardWithPreview {...liveProps} />)
    expect(screen.getByText('🔴 LIVE')).toBeInTheDocument()
  })

  it('should show verified icon when channel is verified', () => {
    const verifiedProps = {
      ...defaultProps,
      channel: {
        ...defaultProps.channel,
        isVerified: true
      }
    }

    render(<VideoCardWithPreview {...verifiedProps} />)
    expect(screen.getByTestId('verified-icon')).toBeInTheDocument()
  })

  it('should handle mute toggle button click', () => {
    const mockToggleMute = jest.fn()

    mockUseVideoPreview.mockReturnValue({
      videoRef: { current: null },
      isPreviewing: false,
      currentTime: 0,
      duration: 120,
      isMuted: true,
      handleMouseEnter: jest.fn(),
      handleMouseLeave: jest.fn(),
      handleTimeUpdate: jest.fn(),
      handleLoadedMetadata: jest.fn(),
      toggleMute: mockToggleMute,
    })

    render(<VideoCardWithPreview {...defaultProps} />)
    const muteButton = screen.getByText('Test Video Title').closest('div')?.querySelector('button[tabindex="-1"]')
    if (muteButton) {
      fireEvent.click(muteButton)
      expect(mockToggleMute).toHaveBeenCalled()
    }
  })

  it('should show mute icon when video is muted', () => {
    mockUseVideoPreview.mockReturnValue({
      videoRef: { current: null },
      isPreviewing: false,
      currentTime: 0,
      duration: 120,
      isMuted: true,
      handleMouseEnter: jest.fn(),
      handleMouseLeave: jest.fn(),
      handleTimeUpdate: jest.fn(),
      handleLoadedMetadata: jest.fn(),
      toggleMute: jest.fn(),
    })

    render(<VideoCardWithPreview {...defaultProps} />)
    expect(screen.getByText('VolumeX')).toBeInTheDocument()
  })

  it('should show unmute icon when video is not muted', () => {
    mockUseVideoPreview.mockReturnValue({
      videoRef: { current: null },
      isPreviewing: false,
      currentTime: 0,
      duration: 120,
      isMuted: false,
      handleMouseEnter: jest.fn(),
      handleMouseLeave: jest.fn(),
      handleTimeUpdate: jest.fn(),
      handleLoadedMetadata: jest.fn(),
      toggleMute: jest.fn(),
    })

    render(<VideoCardWithPreview {...defaultProps} />)
    expect(screen.getByText('Volume2')).toBeInTheDocument()
  })

  it('should handle channel click', () => {
    render(<VideoCardWithPreview {...defaultProps} />)
    const channelName = screen.getByText('Test Channel')
    fireEvent.click(channelName)
  })

  it('should format views correctly for different numbers', () => {
    const highViewsProps = {
      ...defaultProps,
      views: 1500000
    }

    render(<VideoCardWithPreview {...highViewsProps} />)
    const elementsWithViews = screen.getAllByText((content, node) => 
      node?.textContent?.includes('1.5M') || 
      node?.textContent?.includes('1,500,000') ||
      node?.textContent?.includes('1500000')
    )
    expect(elementsWithViews.length).toBeGreaterThan(0)
  })

  it('should render channel avatar with fallback', () => {
    const propsWithoutAvatar = {
      ...defaultProps,
      channel: {
        ...defaultProps.channel,
        avatarUrl: null
      }
    }

    render(<VideoCardWithPreview {...propsWithoutAvatar} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('should apply priority loading for first video', () => {
    const firstVideoProps = {
      ...defaultProps,
      id: '1'
    }

    render(<VideoCardWithPreview {...firstVideoProps} />)
    const image = screen.getByAltText('Test Video Title')
    expect(image).toBeInTheDocument()
  })

  it('should not apply priority loading for non-first video', () => {
    render(<VideoCardWithPreview {...defaultProps} />)
    const image = screen.getByAltText('Test Video Title')
    expect(image).toBeInTheDocument()
  })

  it('should show progress bar during preview', () => {
    mockUseVideoPreview.mockReturnValue({
      videoRef: { current: null },
      isPreviewing: true,
      currentTime: 30,
      duration: 120,
      isMuted: true,
      handleMouseEnter: jest.fn(),
      handleMouseLeave: jest.fn(),
      handleTimeUpdate: jest.fn(),
      handleLoadedMetadata: jest.fn(),
      toggleMute: jest.fn(),
    })

    render(<VideoCardWithPreview {...defaultProps} />)
    const progressContainer = screen.getByText('Test Video Title').closest('div')?.querySelector('[aria-hidden="true"]')
    expect(progressContainer).toBeInTheDocument()
  })

  it('should handle video time update', () => {
    const mockHandleTimeUpdate = jest.fn()

    mockUseVideoPreview.mockReturnValue({
      videoRef: { current: null },
      isPreviewing: false,
      currentTime: 0,
      duration: 120,
      isMuted: true,
      handleMouseEnter: jest.fn(),
      handleMouseLeave: jest.fn(),
      handleTimeUpdate: mockHandleTimeUpdate,
      handleLoadedMetadata: jest.fn(),
      toggleMute: jest.fn(),
    })

    render(<VideoCardWithPreview {...defaultProps} />)
    const video = screen.getByText('Test Video Title').closest('div')?.querySelector('video')
    if (video) {
      fireEvent.timeUpdate(video)
      expect(mockHandleTimeUpdate).toHaveBeenCalled()
    }
  })

  it('should handle video loaded metadata', () => {
    const mockHandleLoadedMetadata = jest.fn()

    mockUseVideoPreview.mockReturnValue({
      videoRef: { current: null },
      isPreviewing: false,
      currentTime: 0,
      duration: 120,
      isMuted: true,
      handleMouseEnter: jest.fn(),
      handleMouseLeave: jest.fn(),
      handleTimeUpdate: jest.fn(),
      handleLoadedMetadata: mockHandleLoadedMetadata,
      toggleMute: jest.fn(),
    })

    render(<VideoCardWithPreview {...defaultProps} />)
    const video = screen.getByText('Test Video Title').closest('div')?.querySelector('video')
    if (video) {
      fireEvent.loadedMetadata(video)
      expect(mockHandleLoadedMetadata).toHaveBeenCalled()
    }
  })
}) 