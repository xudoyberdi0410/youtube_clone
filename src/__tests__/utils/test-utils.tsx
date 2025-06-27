import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data factories
export const mockVideo = {
  id: "test-1",
  title: "Test Video Title",
  views: 1000,
  duration: "10:30",
  uploadedAt: "2 days ago",
  channel: {
    id: "c1",
    name: "Test Channel",
    avatarUrl: "/test-avatar.png",
    isVerified: true,
    subscriberCount: "100K"
  },
  preview: "/test-preview.png"
}

export const mockUser = {
  id: 1,
  email: "test@example.com",
  username: "testuser",
  name: "Test User",
  avatar: "/test-avatar.png",
  is_active: true,
  created_at: "2024-01-01T00:00:00Z"
}

export const mockComment = {
  id: "comment-1",
  text: "This is a test comment",
  author: {
    id: "user-1",
    name: "Test User",
    avatar: "/test-avatar.png"
  },
  likes: 5,
  createdAt: "2024-01-01T00:00:00Z"
}
