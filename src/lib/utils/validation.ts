// src/lib/utils/validation.ts

import { UPLOAD_CONFIG } from '../constants'

/**
 * Validate email format
 * @param email - Email to validate
 * @returns True if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Validation result with errors
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate file upload
 * @param file - File to validate
 * @param type - File type category ('image' | 'video')
 * @returns Validation result
 */
export const validateFileUpload = (
  file: File, 
  type: 'image' | 'video' = 'image'
): { isValid: boolean; error?: string } => {
  // Check file size based on type
  const maxSize = type === 'video' ? UPLOAD_CONFIG.MAX_VIDEO_SIZE : UPLOAD_CONFIG.MAX_FILE_SIZE
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSize / (1024 * 1024)}MB`
    }
  }
  
  // Check file type
  const allowedTypes = type === 'image' 
    ? UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES 
    : UPLOAD_CONFIG.ALLOWED_VIDEO_TYPES as readonly string[]
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    }
  }
  
  return { isValid: true }
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns True if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate username format
 * @param username - Username to validate
 * @returns Validation result
 */
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' }
  }
  
  if (username.length > 20) {
    return { isValid: false, error: 'Username must be no longer than 20 characters' }
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' }
  }
  
  return { isValid: true }
}

/**
 * Validate video title
 * @param title - Video title to validate
 * @returns Validation result
 */
export const validateVideoTitle = (title: string): { isValid: boolean; error?: string } => {
  const trimmedTitle = title.trim()
  
  if (trimmedTitle.length === 0) {
    return { isValid: false, error: 'Title is required' }
  }
  
  if (trimmedTitle.length > 100) {
    return { isValid: false, error: 'Title must be no longer than 100 characters' }
  }
  
  return { isValid: true }
}

/**
 * Sanitize HTML input to prevent XSS
 * @param input - Input string to sanitize
 * @returns Sanitized string
 */
export const sanitizeHtml = (input: string): string => {
  const element = document.createElement('div')
  element.textContent = input
  return element.innerHTML
}
