import { VideoCardSkelton } from "./video-card-skelton"

interface LoadingMoreProps {
  count?: number
}

export function LoadingMore({ count = 6 }: LoadingMoreProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkelton key={`loading-more-${i}`} />
      ))}
    </div>
  )
}
