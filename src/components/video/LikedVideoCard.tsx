// src/components/video/LikedVideoCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { buildImageUrl } from "@/lib/api-config";
import { formatApiDateLocal, formatVideoDuration } from "@/lib/utils/format";
import type { Video as ApiVideo } from "@/types/api";
import { t } from "@/lib/i18n";

interface LikedVideoCardProps {
  video: ApiVideo;
  likeId: number;
  onRemoveLike: (likeId: number) => Promise<boolean>;
}

export function LikedVideoCard({
  video,
  likeId,
  onRemoveLike,
}: LikedVideoCardProps) {
  // YouTube-style card layout, using only available fields from API
  const channelName =
    video.channel_name || video.name || t("video.unknownChannel");
  const videoTitle = video.video_title || video.title || t("video.untitled");
  const thumbnail = video.thumbnail_path;
  const views = video.video_views || video.views || 0;
  const createdAt = video.created_at;
  const videoId = video.id;

  // Корректно строим URL превью через buildImageUrl
  const thumbnailUrl = thumbnail ? buildImageUrl(thumbnail) : "";

  const handleRemoveLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await onRemoveLike(likeId);
  };

  return (
    <div className="w-full max-w-full flex flex-col cursor-pointer group">
      <Link
        href={`/watch?v=${videoId}`}
        className="block w-full aspect-video bg-muted relative overflow-hidden rounded-xl"
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={videoTitle}
            fill
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">
              {t("video.noPreview")}
            </span>
          </div>
        )}
        {(video.duration || video.duration_video) && (
          <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-1.5 py-0.5 rounded-md font-medium z-10">
            {formatVideoDuration(video.duration ?? video.duration_video)}
          </div>
        )}
      </Link>
      <div className="flex flex-row gap-3 pt-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
          {channelName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/watch?v=${videoId}`}>
            <h3 className="font-semibold text-base leading-5 text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1">
              {videoTitle}
            </h3>
          </Link>
          <div className="text-xs text-muted-foreground mb-1">
            <Link
              href={`/channel?name=${encodeURIComponent(channelName)}`}
              className="hover:underline"
            >
              {channelName}
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{views} просмотров</span>
            <span>•</span>
            <span>{formatApiDateLocal(createdAt)}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemoveLike}
          className="ml-2 text-muted-foreground hover:text-destructive"
          title="Удалить лайк"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
