import { Skeleton } from "@/components/ui/skeleton";

export function VideoCardSkelton() {
  return (
    <div className="w-full animate-in fade-in-0 duration-300">
      {/* Thumbnail Skeleton */}
      <div className="relative w-full aspect-video mb-3">
        <Skeleton className="w-full h-full rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      </div>

      {/* Video Info Skeleton */}
      <div className="flex gap-3">
        {/* Avatar Skeleton */}
        <Skeleton className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />

        {/* Details Skeleton */}
        <div className="flex-1 space-y-2">
          {/* Title Skeleton - 2 lines */}
          <Skeleton className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
          <Skeleton className="h-4 w-4/5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
          
          {/* Channel Name Skeleton */}
          <Skeleton className="h-3 w-2/3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
          
          {/* Views and Date Skeleton */}
          <Skeleton className="h-3 w-1/2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
