require('@testing-library/jest-dom')

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock HTMLMediaElement
window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined)
window.HTMLMediaElement.prototype.pause = jest.fn()

// Mock requestFullscreen
HTMLElement.prototype.requestFullscreen = jest.fn().mockResolvedValue(undefined)
document.exitFullscreen = jest.fn().mockResolvedValue(undefined)

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock AbortController
global.AbortController = jest.fn().mockImplementation(() => ({
  abort: jest.fn(),
  signal: {},
}))

// Mock fetch
global.fetch = jest.fn()

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
  },
  writable: true,
})

// Mock navigator.share
Object.defineProperty(navigator, 'share', {
  value: jest.fn().mockResolvedValue(undefined),
  writable: true,
})

// Suppress act(...) warnings and known error messages
const originalError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('not wrapped in act') ||
     message.includes('Error checking auth') ||
     message.includes('Failed to refresh token') ||
     message.includes('API Request failed'))
  ) {
    return;
  }
  originalError(...args);
};

// Suppress known console.warn messages
console.warn = jest.fn((...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Failed to parse date') ||
     args[0].includes('Error reading from cache') ||
     args[0].includes('Error saving to cache'))
  ) {
    return;
  }
});

// Suppress known console.log messages
console.log = jest.fn((...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Token expires soon') ||
     args[0].includes('Received 401 error') ||
     args[0].includes('Attempting to refresh token') ||
     args[0].includes('Token refresh failed') ||
     args[0].includes('Primary video failed, trying fallback...') ||
     args[0].includes('Non-critical error, keeping tokens'))
  ) {
    return;
  }
});
