// src/hooks/index.ts

// API Hooks
export { useApi } from './use-api'
export { useVideos } from './use-videos'
export { useInfiniteVideos } from './use-infinite-videos'
export { useVideo } from './use-video'
export { useVideoWithCache } from './use-video-with-cache'
export { useVideoStats } from './use-video-stats'
export { useVideoComments } from './use-video-comments'
export { useVideoPreview } from './use-video-preview'
export { useVideoCache } from './use-video-cache'
export { useInstantPlay } from './use-instant-play'

// Auth Hooks
export { useAuth } from '@/modules/auth/hooks/use-auth'
export { useLikes } from './use-likes'
export { useLikedVideos } from './use-liked-videos'

// Playlist Hooks
export { usePlaylist } from './use-playlist'
export { usePlaylists } from './use-playlists'

// Subscription Hooks
export { useSubscriptions } from './use-subscriptions'

// UI Hooks
export { useMobile } from './use-mobile'
export { useToast } from './use-toast'
export { useLocalStorage } from './use-local-storage'
export { useIsClient } from './use-is-client'

// Memory Leak Prevention Hooks
export { useIsMounted } from './use-is-mounted'
export { useSafeTimeout } from './use-safe-timeout'
