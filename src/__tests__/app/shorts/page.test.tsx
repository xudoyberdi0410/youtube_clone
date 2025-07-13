import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ShortsPage from '@/app/shorts/page'

// Mock the ShortsFeed component
jest.mock('@/modules/shorts/ShortsFeed', () => ({
  ShortsFeed: () => (
    <div data-testid="shorts-feed">
      <h1>Shorts Feed</h1>
      <div>Short videos content</div>
    </div>
  ),
}))

describe('Shorts Page', () => {
  it('renders ShortsFeed component', () => {
    render(<ShortsPage />)
    
    expect(screen.getByTestId('shorts-feed')).toBeInTheDocument()
    expect(screen.getByText('Shorts Feed')).toBeInTheDocument()
    expect(screen.getByText('Short videos content')).toBeInTheDocument()
  })
}) 