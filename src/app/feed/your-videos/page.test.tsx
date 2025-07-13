import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import YourVideosPage from './page'

jest.mock('@/modules/auth/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}))

jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
}))

jest.mock('@/components/auth/AuthRequiredDialog', () => ({
  AuthRequiredDialog: (props: unknown) => (
    <div data-testid="auth-dialog" data-open={(props as { open: boolean }).open} data-title={(props as { title: string }).title} data-description={(props as { description: string }).description} />
  ),
}))

describe('YourVideosPage', () => {
  let useAuth: any

  beforeAll(async () => {
    const authModule = await import('@/modules/auth/hooks/use-auth')
    useAuth = authModule.useAuth
  })

  it('показывает skeleton при loading', () => {
    useAuth.mockReturnValue({ isLoggedIn: false, loading: true })
    render(<YourVideosPage />)
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('показывает приглашение к авторизации, если не залогинен', () => {
    useAuth.mockReturnValue({ isLoggedIn: false, loading: false })
    render(<YourVideosPage />)
    expect(screen.getByText('auth.signInToViewYourVideos')).toBeInTheDocument()
    expect(screen.getByText('auth.uploadAndManage')).toBeInTheDocument()
    expect(screen.getByText('auth.signIn')).toBeInTheDocument()
    // Диалог не открыт по умолчанию
    expect(screen.getByTestId('auth-dialog')).toHaveAttribute('data-open', 'false')
    // Открываем диалог
    fireEvent.click(screen.getByText('auth.signIn'))
    expect(screen.getByTestId('auth-dialog')).toHaveAttribute('data-open', 'true')
  })

  it('показывает пустое состояние для авторизованного пользователя', () => {
    useAuth.mockReturnValue({ isLoggedIn: true, loading: false })
    render(<YourVideosPage />)
    expect(screen.getByText('yourVideos.title')).toBeInTheDocument()
    expect(screen.getByText('yourVideos.emptyTitle')).toBeInTheDocument()
    expect(screen.getByText('yourVideos.emptyDescription')).toBeInTheDocument()
  })
}) 