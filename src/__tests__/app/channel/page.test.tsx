import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChannelPageWrapper from '@/app/channel/page'

jest.mock('@/modules/channel/hooks/use-channel-page-data', () => ({
  useChannelPageData: jest.fn(),
}))

jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
  getCurrentLanguage: () => 'en',
}))

jest.mock('@/lib/utils/format', () => ({
  formatFullDateIntl: () => 'Formatted Date',
}))

jest.mock('@/modules/channel/ui/components/channel-header', () => ({
  ChannelHeader: ({ channel }: { channel: unknown }) => (
    <div data-testid="channel-header" data-channel-id={(channel as { id: string }).id}>
      Channel Header - {(channel as { name: string }).name}
    </div>
  ),
}))

jest.mock('@/modules/channel/ui/components/channel-tabs', () => ({
  ChannelTabs: ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => (
    <div data-testid="channel-tabs">
      <button onClick={() => onTabChange('home')} data-active={activeTab === 'home'}>Home</button>
      <button onClick={() => onTabChange('videos')} data-active={activeTab === 'videos'}>Videos</button>
      <button onClick={() => onTabChange('about')} data-active={activeTab === 'about'}>About</button>
    </div>
  ),
}))

jest.mock('@/components/video/video-grid', () => ({
  VideoGrid: ({ videos, currentChannelId }: { videos: unknown[]; currentChannelId: string }) => (
    <div data-testid="video-grid" data-channel-id={currentChannelId}>
      Video Grid - {videos.length} videos
    </div>
  ),
}))

jest.mock('@/components/ui/loading-spinner', () => ({
  LoadingSpinner: ({ size }: { size: string }) => (
    <div data-testid="loading-spinner" data-size={size}>Loading...</div>
  ),
}))

describe('Channel Page', () => {
  let useChannelPageData: jest.Mock

  beforeAll(async () => {
    const channelModule = await import('@/modules/channel/hooks/use-channel-page-data')
    useChannelPageData = channelModule.useChannelPageData
  })

  const mockChannel = {
    id: 'channel-1',
    name: 'Test Channel',
    description: 'Test description',
    created_at: '2023-01-01',
  }

  const mockVideos = [
    { id: 'video-1', title: 'Test Video 1' },
    { id: 'video-2', title: 'Test Video 2' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('показывает ошибку, если имя канала не предоставлено', () => {
    useChannelPageData.mockReturnValue({
      channelName: null,
      channel: null,
      channelLoading: false,
      channelError: null,
      videos: [],
      loading: false,
      error: null,
    })

    render(<ChannelPageWrapper />)
    expect(screen.getByText('channel.nameNotProvided')).toBeInTheDocument()
  })

  it('показывает loading spinner при загрузке', () => {
    useChannelPageData.mockReturnValue({
      channelName: 'test-channel',
      channel: null,
      channelLoading: true,
      channelError: null,
      videos: [],
      loading: false,
      error: null,
    })

    render(<ChannelPageWrapper />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('показывает ошибку при неудачной загрузке', () => {
    useChannelPageData.mockReturnValue({
      channelName: 'test-channel',
      channel: null,
      channelLoading: false,
      channelError: 'Channel not found',
      videos: [],
      loading: false,
      error: null,
    })

    render(<ChannelPageWrapper />)
    expect(screen.getByText('Channel not found')).toBeInTheDocument()
  })

  it('рендерит канал с табами и контентом', () => {
    useChannelPageData.mockReturnValue({
      channelName: 'test-channel',
      channel: mockChannel,
      channelLoading: false,
      channelError: null,
      videos: mockVideos,
      loading: false,
      error: null,
    })

    render(<ChannelPageWrapper />)
    
    expect(screen.getByTestId('channel-header')).toBeInTheDocument()
    expect(screen.getByTestId('channel-tabs')).toBeInTheDocument()
    expect(screen.getByTestId('video-grid')).toBeInTheDocument()
    expect(screen.getByText('Video Grid - 2 videos')).toBeInTheDocument()
  })

  it('переключает табы и показывает соответствующий контент', () => {
    useChannelPageData.mockReturnValue({
      channelName: 'test-channel',
      channel: mockChannel,
      channelLoading: false,
      channelError: null,
      videos: mockVideos,
      loading: false,
      error: null,
    })

    render(<ChannelPageWrapper />)
    
    // Переключаем на таб About
    const aboutButton = screen.getByText('About')
    fireEvent.click(aboutButton)
    
    expect(screen.getByText('channel.about')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('channel.created: Formatted Date')).toBeInTheDocument()
  })
}) 