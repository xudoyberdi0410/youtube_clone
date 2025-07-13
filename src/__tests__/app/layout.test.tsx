import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RootLayout from '@/app/layout'

// Mock the providers and components
jest.mock('@/modules/auth/context/auth-context', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}))

jest.mock('@/components/layouts/BaseLayout', () => ({
  BaseLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="base-layout">{children}</div>
  ),
}))

jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}))

// Mock fonts
jest.mock('next/font/google', () => ({
  Roboto: () => ({
    variable: '--font-roboto',
    style: { fontFamily: 'Roboto' },
  }),
  Roboto_Mono: () => ({
    variable: '--font-roboto-mono',
    style: { fontFamily: 'Roboto Mono' },
  }),
}))

describe('Root Layout', () => {
  it('renders with all providers and layout components', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    // Check if all providers are rendered
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument()
    expect(screen.getByTestId('base-layout')).toBeInTheDocument()
    
    // Check if children are rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders children correctly', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    // Check if children are rendered through the provider chain
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
}) 