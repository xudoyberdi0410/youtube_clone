// src/components/video/VideoCommentsWrapper.tsx

'use client'

import dynamic from 'next/dynamic'

// Динамически загружаем компонент комментариев без SSR
const VideoComments = dynamic(() => import('./VideoComments').then(mod => ({ default: mod.VideoComments })), {
  ssr: false,
  loading: () => (
    <div className="bg-white p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

interface VideoCommentsWrapperProps {
  videoId: string
  className?: string
}

export function VideoCommentsWrapper({ videoId, className }: VideoCommentsWrapperProps) {
  return <VideoComments videoId={videoId} className={className} />
}
