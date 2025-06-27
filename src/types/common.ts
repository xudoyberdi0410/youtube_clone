// src/types/common.ts

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  success?: boolean
  errors?: string[]
}

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: unknown
}

export interface User {
  id: string
  username: string
  email: string
  name?: string
  avatar?: string
  isVerified?: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  subscriberCount?: number
  bio?: string
  location?: string
  website?: string
}

// Form types
export interface BaseFormData {
  [key: string]: string | number | boolean | File | null | undefined
}

// File upload types
export interface FileUploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UploadedFile {
  url: string
  filename: string
  size: number
  mimetype: string
}

// Sorting and filtering
export type SortOrder = 'asc' | 'desc'

export interface SortConfig {
  field: string
  order: SortOrder
}

export interface FilterConfig {
  [key: string]: string | number | boolean | string[] | undefined
}

// Common props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Navigation types
export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  isActive?: boolean
  badge?: string | number
}

// Search types
export interface SearchResult<T = unknown> {
  id: string
  title: string
  description?: string
  thumbnail?: string
  type: 'video' | 'channel' | 'playlist'
  data: T
}
