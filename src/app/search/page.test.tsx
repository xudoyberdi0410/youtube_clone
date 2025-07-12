import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SearchPage from './page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

// Mock the SearchPageContent component
jest.mock('@/modules/home/ui/components/search/SearchPageContent', () => ({
  SearchPageContent: ({ query, videos }: { query: string; videos: any[] }) => (
    <div data-testid="search-page-content" data-query={query}>
      Search Results for: {query}
      <div data-testid="videos-count">Found {videos.length} videos</div>
      {videos.map((video) => (
        <div key={video.id} data-testid={`video-${video.id}`}>
          {video.title}
        </div>
      ))}
    </div>
  ),
}))

describe('Search Page', () => {
  const useSearchParams = require('next/navigation').useSearchParams

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search page with empty query', () => {
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    })

    render(<SearchPage />)
    
    expect(screen.getByTestId('search-page-content')).toBeInTheDocument()
    expect(screen.getByTestId('search-page-content')).toHaveAttribute('data-query', '')
    expect(screen.getByText('Search Results for:')).toBeInTheDocument()
    expect(screen.getByText('Found 3 videos')).toBeInTheDocument()
  })

  it('renders search page with query parameter', () => {
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('test query'),
    })

    render(<SearchPage />)
    
    expect(screen.getByTestId('search-page-content')).toBeInTheDocument()
    expect(screen.getByTestId('search-page-content')).toHaveAttribute('data-query', 'test query')
    expect(screen.getByText('Search Results for: test query')).toBeInTheDocument()
  })

  it('renders all mock videos', () => {
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('test'),
    })

    render(<SearchPage />)
    
    expect(screen.getByTestId('video-1')).toBeInTheDocument()
    expect(screen.getByTestId('video-2')).toBeInTheDocument()
    expect(screen.getByTestId('video-3')).toBeInTheDocument()
    
    expect(screen.getByText('Mock Video 1')).toBeInTheDocument()
    expect(screen.getByText('Mock Video 2')).toBeInTheDocument()
    expect(screen.getByText('Mock Video 3')).toBeInTheDocument()
  })

  it('handles undefined searchParams gracefully', () => {
    useSearchParams.mockReturnValue(undefined)

    render(<SearchPage />)
    
    expect(screen.getByTestId('search-page-content')).toBeInTheDocument()
    expect(screen.getByTestId('search-page-content')).toHaveAttribute('data-query', '')
  })
}) 