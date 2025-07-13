import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import WatchPage from '@/app/watch/page'

// Mock the WatchVideo component
jest.mock('@/modules/home/ui/components/watch-video', () => ({
  WatchVideo: ({ videoId, startTime }: { videoId: string; startTime: number }) => (
    <div data-testid="watch-video" data-video-id={videoId} data-start-time={startTime}>
      Watch Video - {videoId} at {startTime}s
    </div>
  ),
}))

describe('Watch Page', () => {
  it('renders with default video ID when no search params', async () => {
    const searchParams = Promise.resolve({})
    render(await WatchPage({ searchParams }))
    
    expect(screen.getByTestId('watch-video')).toBeInTheDocument()
    expect(screen.getByText('Watch Video - big-buck-bunny at 0s')).toBeInTheDocument()
    expect(screen.getByTestId('watch-video')).toHaveAttribute('data-video-id', 'big-buck-bunny')
    expect(screen.getByTestId('watch-video')).toHaveAttribute('data-start-time', '0')
  })

  it('renders with custom video ID from search params', async () => {
    const searchParams = Promise.resolve({ v: 'custom-video-id' })
    render(await WatchPage({ searchParams }))
    
    expect(screen.getByTestId('watch-video')).toBeInTheDocument()
    expect(screen.getByText('Watch Video - custom-video-id at 0s')).toBeInTheDocument()
    expect(screen.getByTestId('watch-video')).toHaveAttribute('data-video-id', 'custom-video-id')
    expect(screen.getByTestId('watch-video')).toHaveAttribute('data-start-time', '0')
  })

  it('renders with start time from search params', async () => {
    const searchParams = Promise.resolve({ v: 'test-video', t: '30' })
    render(await WatchPage({ searchParams }))
    
    expect(screen.getByTestId('watch-video')).toBeInTheDocument()
    expect(screen.getByText('Watch Video - test-video at 30s')).toBeInTheDocument()
    expect(screen.getByTestId('watch-video')).toHaveAttribute('data-video-id', 'test-video')
    expect(screen.getByTestId('watch-video')).toHaveAttribute('data-start-time', '30')
  })

  it('handles invalid start time gracefully', async () => {
    const searchParams = Promise.resolve({ v: 'test-video', t: 'invalid' })
    render(await WatchPage({ searchParams }))
    
    expect(screen.getByTestId('watch-video')).toBeInTheDocument()
    expect(screen.getByText('Watch Video - test-video at 0s')).toBeInTheDocument()
    expect(screen.getByTestId('watch-video')).toHaveAttribute('data-start-time', '0')
  })
}) 