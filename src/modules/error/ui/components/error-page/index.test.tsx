import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ErrorPage } from './index'

jest.mock('@/lib/i18n', () => ({
  t: (key: string) => key,
}))

describe('ErrorPage', () => {
  it('renders error title, description и кнопку retry', () => {
    const error = new Error('Test error')
    const reset = jest.fn()
    render(<ErrorPage error={error} reset={reset} />)
    expect(screen.getByText('error.title')).toBeInTheDocument()
    expect(screen.getByText('error.description')).toBeInTheDocument()
    expect(screen.getByText('error.retry')).toBeInTheDocument()
  })

  it('вызывает reset при клике на кнопку retry', () => {
    const error = new Error('Test error')
    const reset = jest.fn()
    render(<ErrorPage error={error} reset={reset} />)
    fireEvent.click(screen.getByText('error.retry'))
    expect(reset).toHaveBeenCalled()
  })
}) 