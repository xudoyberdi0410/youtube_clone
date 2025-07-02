// src/lib/constants.ts

// App Constants
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'YouTube Clone',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
} as const

// File Upload Constants
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB for images
  MAX_VIDEO_SIZE: Number(process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE) || 100 * 1024 * 1024, // 100MB for videos
  ALLOWED_IMAGE_TYPES: (process.env.NEXT_PUBLIC_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/mov', 'video/avi'] as const,
} as const

// UI Constants
export const UI_CONFIG = {
  NAVBAR_HEIGHT: 56,
  SIDEBAR_WIDTH: 240,
  MINI_SIDEBAR_WIDTH: 72,
  SIDEBAR_BREAKPOINT: 1024,
  MAX_CONTENT_WIDTH: 1284,
} as const

// Video Constants
export const VIDEO_CONFIG = {
  GRID_COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
    LARGE: 4,
  },
  THUMBNAIL_ASPECT_RATIO: 16 / 9,
  DEFAULT_THUMBNAIL: '/previews/default.jpg',
} as const

// Routes Constants
export const ROUTES = {
  HOME: '/',
  WATCH: '/watch',
  UPLOAD: '/upload',
  SETTINGS: '/settings',
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
  },
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
} as const

// API Constants
export const API_CONSTANTS = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

// YouTube-like Categories
export const VIDEO_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'music', name: 'Music' },
  { id: 'live', name: 'Live' },
  { id: 'news', name: 'News' },
  { id: 'sports', name: 'Sports' },
  { id: 'learning', name: 'Learning' },
  { id: 'trending', name: 'Trending' },
] as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FILE_TOO_LARGE: `File size must be less than ${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'Invalid file type. Please select a valid image.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  AVATAR_UPLOADED: 'Avatar uploaded successfully',
  VIDEO_UPLOADED: 'Video uploaded successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const
