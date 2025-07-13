import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NotFoundPage } from '@/modules/not-found/ui/components/not-found-page'

jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
}))

describe('NotFoundPage', () => {
  it('renders 404, title, description и кнопку Home', () => {
    render(<NotFoundPage />)
    expect(screen.getByText('notFound.404')).toBeInTheDocument()
    expect(screen.getByText('notFound.title')).toBeInTheDocument()
    expect(screen.getByText('notFound.description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument()
  })
}) 