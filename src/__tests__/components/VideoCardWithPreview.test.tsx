import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { VideoCardWithPreview } from '@/components/video/VideoCardWithPreview'

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
    return <img src={src} alt={alt} {...props} />
  },
}))

// Mock Avatar component
jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, className }: any) => <div className={className}>{children}</div>,
  AvatarImage: ({ src, alt }: any) => <img src={src} alt={alt} />,
  AvatarFallback: ({ children }: any) => <div>{children}</div>
}))

// Mock Badge component
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={`badge ${variant} ${className}`}>{children}</span>
  )
}))

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>{children}</button>
  )
}))

// Mock DropdownMenu components
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: any) => {
    if (asChild) return children
    return <button>{children}</button>
  },
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick, asChild }: any) => {
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

  it('should render video card with all props', () => {
    render(<VideoCardWithPreview {...defaultProps} />)
    expect(screen.getByText('Test Video Title')).toBeInTheDocument()
  })
}) 