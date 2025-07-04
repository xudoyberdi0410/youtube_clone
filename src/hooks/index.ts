// src/hooks/index.ts

// Re-export all custom hooks
export { useAuth } from '@/modules/auth/hooks/use-auth'
export { useSettings } from '@/modules/settings/hooks/use-settings'
export { useLocalStorage } from './use-local-storage'
export { useApi } from './use-api'
export { useIsClient } from './use-is-client'
export { useVideos } from './use-videos'
export { useVideo } from './use-video'
export { useLikes } from './use-likes'
export { useVideoComments } from './use-video-comments'
export { useSubscriptions } from './use-subscriptions'
export { useVideoStats } from './use-video-stats'
export { usePlaylists } from './use-playlists'
export { usePlaylist } from './use-playlist'

// Re-export existing hooks from components/ui
export { useIsMobile } from './use-mobile'
export { useToast } from './use-toast'
