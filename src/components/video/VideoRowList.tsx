import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildImageUrl } from "@/lib/api-config";
import type { Video } from "@/types/api";
import { t } from "@/lib/i18n";
import { formatVideoDuration } from "@/lib/utils/format";

interface VideoRowListProps {
  videos: Video[];
  skeletonCount?: number;
}

export function VideoRowList({ videos, skeletonCount = 8 }: VideoRowListProps) {
  // Skeleton loader для случая, когда видео еще не загружены
  if (!videos || videos.length === 0) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="w-72 flex-shrink-0">
            <div className="w-full aspect-video bg-muted rounded-xl animate-pulse" />
            <div className="flex items-start gap-3 pt-3">
              <div className="w-9 h-9 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-full h-4 bg-muted rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Отображение списка видео
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {videos.map((video) => (
        <Link
          key={video.id}
          href={`/watch?v=${video.id}`}
          className="block w-72 flex-shrink-0 group"
        >
          {/* Блок с превью видео */}
          <div className="relative aspect-video">
            {video.thumbnail_path ? (
              <Image
                src={buildImageUrl(video.thumbnail_path)}
                alt={video.video_title || video.title || t("video.untitled")}
                fill
                className="object-cover rounded-xl group-hover:shadow-lg transition-shadow"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl">
                <span className="text-muted-foreground text-sm">
                  {t("video.noPreview")}
                </span>
              </div>
            )}
            {/* Длительность видео */}
            {(video.duration || video.duration_video) && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">
                {formatVideoDuration(video.duration ?? video.duration_video)}
              </div>
            )}
          </div>

          {/* Блок с информацией о видео */}
          <div className="flex items-start gap-3 pt-3">
            {/* Аватар канала */}
            <Avatar className="w-9 h-9 mt-0.5">
              <AvatarImage src={video.profile_image || ""} />
              <AvatarFallback>
                {(video.channel_name || video.name || "C").charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Текстовая информация */}
            <div className="flex flex-col">
              <h3 className="text-base font-bold line-clamp-2 leading-snug">
                {video.video_title || video.title}
              </h3>
              <span className="text-sm text-muted-foreground mt-1 truncate group-hover:text-foreground transition-colors">
                {video.channel_name || video.name}
              </span>
              <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                <span>
                  {video.video_views || 0} {t("video.views")}
                </span>
                <span>•</span>
                <span>{video.created_at?.slice(0, 10)}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
