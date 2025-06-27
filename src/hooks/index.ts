// src/hooks/index.ts

// Re-export all custom hooks
export { useAuth } from '@/modules/auth/hooks/use-auth'
export { useSettings } from '@/modules/settings/hooks/use-settings'
export { useLocalStorage } from './use-local-storage'
export { useApi } from './use-api'

// Re-export existing hooks from components/ui
export { useIsMobile } from './use-mobile'
export { useToast } from './use-toast'
