import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AuthPage from './page'

// Mock the Auth component
jest.mock('@/modules/auth/ui/components/auth', () => ({
  Auth: ({ mode }: { mode: string }) => (
    <div data-testid="auth-component" data-mode={mode}>
      Auth Component - {mode}
    </div>
  ),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

describe('Auth Page', () => {
  it('renders signin mode correctly', async () => {
    const params = Promise.resolve({ mode: 'signin' })
    render(await AuthPage({ params }))
    
    expect(screen.getByTestId('auth-component')).toBeInTheDocument()
    expect(screen.getByText('Auth Component - signin')).toBeInTheDocument()
    expect(screen.getByTestId('auth-component')).toHaveAttribute('data-mode', 'signin')
  })

  it('renders signup mode correctly', async () => {
    const params = Promise.resolve({ mode: 'signup' })
    render(await AuthPage({ params }))
    
    expect(screen.getByTestId('auth-component')).toBeInTheDocument()
    expect(screen.getByText('Auth Component - signup')).toBeInTheDocument()
    expect(screen.getByTestId('auth-component')).toHaveAttribute('data-mode', 'signup')
  })

  it('calls notFound for invalid mode', async () => {
    const { notFound } = require('next/navigation')
    const params = Promise.resolve({ mode: 'invalid' })
    
    try {
      await AuthPage({ params })
    } catch (error) {
      // Expected to throw due to notFound call
    }
    
    expect(notFound).toHaveBeenCalled()
  })
}) 