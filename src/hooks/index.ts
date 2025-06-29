// src/hooks/index.ts

// Re-export all custom hooks
export { useAuth } from '@/modules/auth/hooks/use-auth'
export { useSettings } from '@/modules/settings/hooks/use-settings'
export { useLocalStorage } from './use-local-storage'
export { useApi } from './use-api'
export { useVideos } from './use-videos'
export { useVideo } from './use-video'
export { useLikes } from './use-likes'
export { useComments } from './use-comments'
export { useSubscriptions } from './use-subscriptions'
export { useVideoStats } from './use-video-stats'

// Re-export existing hooks from components/ui
export { useIsMobile } from './use-mobile'
export { useToast } from './use-toast'
