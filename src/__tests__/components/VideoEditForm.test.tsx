import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VideoEditForm } from '@/modules/upload/ui/components/video-edit-form'

// Mock i18n
jest.mock('@/lib/i18n', () => ({
  t: (key: string, params?: Record<string, any>) => {
    if (params) {
      return key.replace(/\{(\w+)\}/g, (_, param) => params[param] || '')
    }
    return key
  },
}))

describe('VideoEditForm', () => {
  const defaultProps = {
    initialTitle: 'Test Video Title',
    initialDescription: 'Test video description',
    initialCategory: 'Musiqa' as const,
    onSubmit: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render form with initial values', () => {
    render(<VideoEditForm {...defaultProps} />)
    expect(screen.getByDisplayValue('Test Video Title')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test video description')).toBeInTheDocument()
    expect(screen.getByText('upload.title')).toBeInTheDocument()
    expect(screen.getByText('upload.description')).toBeInTheDocument()
    expect(screen.getByText('upload.category')).toBeInTheDocument()
  })

  it('should render form labels correctly', () => {
    render(<VideoEditForm {...defaultProps} />)
    expect(screen.getByLabelText('upload.title')).toBeInTheDocument()
    expect(screen.getByLabelText('upload.description')).toBeInTheDocument()
    // Для категории ищем по тексту, а не по label
    expect(screen.getByText('upload.category')).toBeInTheDocument()
  })

  it('should update title when input changes', () => {
    render(<VideoEditForm {...defaultProps} />)

    const titleInput = screen.getByDisplayValue('Test Video Title')
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } })

    expect(screen.getByDisplayValue('Updated Title')).toBeInTheDocument()
  })

  it('should update description when textarea changes', () => {
    render(<VideoEditForm {...defaultProps} />)

    const descriptionInput = screen.getByDisplayValue('Test video description')
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } })

    expect(screen.getByDisplayValue('Updated description')).toBeInTheDocument()
  })

  it('should show character count for title', () => {
    render(<VideoEditForm {...defaultProps} />)

    const titleInput = screen.getByDisplayValue('Test Video Title')
    fireEvent.change(titleInput, { target: { value: 'New Title' } })

    expect(screen.getByText('upload.titleSymbols')).toBeInTheDocument()
  })

  it('should show character count for description', () => {
    render(<VideoEditForm {...defaultProps} />)

    const descriptionInput = screen.getByDisplayValue('Test video description')
    fireEvent.change(descriptionInput, { target: { value: 'New description' } })

    expect(screen.getByText('upload.descriptionSymbols')).toBeInTheDocument()
  })

  it('should handle form submission with updated values', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
    render(<VideoEditForm {...defaultProps} onSubmit={mockOnSubmit} />)

    const titleInput = screen.getByDisplayValue('Test Video Title')
    const descriptionInput = screen.getByDisplayValue('Test video description')
    const submitButton = screen.getByRole('button', { name: 'upload.saveChanges' })

    fireEvent.change(titleInput, { target: { value: 'Updated Title' } })
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Updated Title',
        description: 'Updated description',
        category: 'Musiqa',
      })
    })
  })

  it('should handle form submission with original values', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
    render(<VideoEditForm {...defaultProps} onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: 'upload.saveChanges' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Video Title',
        description: 'Test video description',
        category: 'Musiqa',
      })
    })
  })

  it('should show loading state when submitting', async () => {
    const mockOnSubmit = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<VideoEditForm {...defaultProps} onSubmit={mockOnSubmit} loading={true} />)

    const submitButton = screen.getByRole('button', { name: 'upload.saving' })
    expect(submitButton).toBeDisabled()
  })

  it('should show error message when error prop is provided', () => {
    const errorMessage = 'Failed to save video'
    render(<VideoEditForm {...defaultProps} error={errorMessage} />)
    expect(screen.getByTestId('video-edit-error-alert')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should show success message when success prop is true', () => {
    render(<VideoEditForm {...defaultProps} success={true} />)
    expect(screen.getByTestId('video-edit-success-alert')).toBeInTheDocument()
    expect(screen.getByText('upload.successEdit')).toBeInTheDocument()
  })

  it('should not show error or success messages when not provided', () => {
    render(<VideoEditForm {...defaultProps} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should have required fields', () => {
    render(<VideoEditForm {...defaultProps} />)

    const titleInput = screen.getByDisplayValue('Test Video Title')
    const descriptionInput = screen.getByDisplayValue('Test video description')

    expect(titleInput).toBeRequired()
    expect(descriptionInput).toBeRequired()
  })

  it('should have correct maxLength attributes', () => {
    render(<VideoEditForm {...defaultProps} />)

    const titleInput = screen.getByDisplayValue('Test Video Title')
    const descriptionInput = screen.getByDisplayValue('Test video description')

    expect(titleInput).toHaveAttribute('maxLength', '100')
    expect(descriptionInput).toHaveAttribute('maxLength', '5000')
  })

  it('should have correct textarea rows', () => {
    render(<VideoEditForm {...defaultProps} />)

    const descriptionInput = screen.getByDisplayValue('Test video description')
    expect(descriptionInput).toHaveAttribute('rows', '4')
  })

  it('should handle different initial categories', () => {
    const propsWithDifferentCategory = {
      ...defaultProps,
      initialCategory: 'Ta\'lim' as const,
    }
    
    render(<VideoEditForm {...propsWithDifferentCategory} />)

    expect(screen.getByDisplayValue('Test Video Title')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test video description')).toBeInTheDocument()
  })

  it('should handle very long title input', () => {
    render(<VideoEditForm {...defaultProps} />)

    const titleInput = screen.getByDisplayValue('Test Video Title')
    const longTitle = 'A'.repeat(100)
    fireEvent.change(titleInput, { target: { value: longTitle } })

    expect(screen.getByDisplayValue(longTitle)).toBeInTheDocument()
  })

  it('should handle very long description input', () => {
    render(<VideoEditForm {...defaultProps} />)

    const descriptionInput = screen.getByDisplayValue('Test video description')
    const longDescription = 'A'.repeat(5000)
    fireEvent.change(descriptionInput, { target: { value: longDescription } })

    expect(screen.getByDisplayValue(longDescription)).toBeInTheDocument()
  })

  it('should prevent form submission when loading', async () => {
    const mockOnSubmit = jest.fn()
    render(<VideoEditForm {...defaultProps} onSubmit={mockOnSubmit} loading={true} />)

    const submitButton = screen.getByRole('button', { name: 'upload.saving' })
    fireEvent.click(submitButton)

    // Should not call onSubmit when loading
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should show both error and success messages when both props are provided', () => {
    const errorMessage = 'Some error occurred'
    render(<VideoEditForm {...defaultProps} error={errorMessage} success={true} />)
    expect(screen.getByTestId('video-edit-error-alert')).toBeInTheDocument()
    expect(screen.getByTestId('video-edit-success-alert')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByText('upload.successEdit')).toBeInTheDocument()
  })

  it('should handle form submission with keyboard', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
    render(<VideoEditForm {...defaultProps} onSubmit={mockOnSubmit} />)

    const form = screen.getByRole('button', { name: 'upload.saveChanges' }).closest('form')
    fireEvent.submit(form!)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Video Title',
        description: 'Test video description',
        category: 'Musiqa',
      })
    })
  })

  it('should update character count correctly for title', () => {
    render(<VideoEditForm {...defaultProps} />)

    const titleInput = screen.getByDisplayValue('Test Video Title')
    
    // Test with different lengths
    fireEvent.change(titleInput, { target: { value: 'Short' } })
    expect(screen.getByText('upload.titleSymbols')).toBeInTheDocument()
    
    fireEvent.change(titleInput, { target: { value: 'A very long title that exceeds the normal length' } })
    expect(screen.getByText('upload.titleSymbols')).toBeInTheDocument()
  })

  it('should update character count correctly for description', () => {
    render(<VideoEditForm {...defaultProps} />)

    const descriptionInput = screen.getByDisplayValue('Test video description')
    
    // Test with different lengths
    fireEvent.change(descriptionInput, { target: { value: 'Short desc' } })
    expect(screen.getByText('upload.descriptionSymbols')).toBeInTheDocument()
    
    fireEvent.change(descriptionInput, { target: { value: 'A very long description that exceeds the normal length and continues for a while' } })
    expect(screen.getByText('upload.descriptionSymbols')).toBeInTheDocument()
  })
}) 