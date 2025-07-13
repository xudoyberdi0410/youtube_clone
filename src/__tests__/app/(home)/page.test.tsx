import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '@/app/(home)/page'

// Mock the HomeVideos component
jest.mock('@/modules/home/ui/components/home-videos', () => ({
  __esModule: true,
  default: () => <div data-testid="home-videos">Home Videos Component</div>,
}))

// Mock test-proxy
jest.mock('@/lib/test-proxy', () => ({}))

describe('Home Page', () => {
  it('renders HomeVideos component', () => {
    render(<Home />)
    expect(screen.getByTestId('home-videos')).toBeInTheDocument()
    expect(screen.getByText('Home Videos Component')).toBeInTheDocument()
  })
}) 