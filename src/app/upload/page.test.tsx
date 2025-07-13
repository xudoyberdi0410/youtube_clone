import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import UploadPage from './page'

jest.mock('@/modules/auth/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}))

jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
}))

jest.mock('@/modules/upload/ui/components/upload-video-form', () => ({
  UploadVideoForm: () => <div data-testid="upload-form">Upload Video Form</div>,
}))

jest.mock('@/components/auth/AuthRequiredDialog', () => ({
  AuthRequiredDialog: (props: unknown) => (
    <div data-testid="auth-dialog" data-open={(props as { open: boolean }).open} data-title={(props as { title: string }).title} data-description={(props as { description: string }).description} />
  ),
}))

describe('Upload Page', () => {
  let useAuth: unknown

  beforeAll(async () => {
    const authModule = await import('@/modules/auth/hooks/use-auth')
    useAuth = authModule.useAuth
  })

  it('показывает skeleton при loading', () => {
    useAuth.mockReturnValue({ isLoggedIn: false, loading: true })
    render(<UploadPage />)
    
    // Проверяем наличие skeleton элементов
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('показывает приглашение к авторизации, если не залогинен', () => {
    useAuth.mockReturnValue({ isLoggedIn: false, loading: false })
    render(<UploadPage />)
    
    expect(screen.getByText('upload.authRequiredTitle')).toBeInTheDocument()
    expect(screen.getByText('upload.authRequiredDesc')).toBeInTheDocument()
    expect(screen.getByText('upload.authRequiredBtn')).toBeInTheDocument()
    
    // Диалог не открыт по умолчанию
    expect(screen.getByTestId('auth-dialog')).toHaveAttribute('data-open', 'false')
    
    // Открываем диалог
    fireEvent.click(screen.getByText('upload.authRequiredBtn'))
    expect(screen.getByTestId('auth-dialog')).toHaveAttribute('data-open', 'true')
  })

  it('показывает форму загрузки для авторизованного пользователя', () => {
    useAuth.mockReturnValue({ isLoggedIn: true, loading: false })
    render(<UploadPage />)
    
    expect(screen.getByText('upload.title')).toBeInTheDocument()
    expect(screen.getByText('upload.shareWithWorld')).toBeInTheDocument()
    expect(screen.getByTestId('upload-form')).toBeInTheDocument()
  })
}) 