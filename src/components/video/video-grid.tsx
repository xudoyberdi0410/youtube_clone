"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { buildImageUrl } from "@/lib/api-config";
import { formatVideoDuration, formatRelativeTimeIntl } from "@/lib/utils/format";
import type { Video } from "@/types/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { t } from "@/lib/i18n";
import { getCurrentLanguage } from "@/lib/i18n";
import { apiClient } from "@/lib/api-client";

interface VideoGridProps {
  videos: Video[];
  className?: string;
  currentChannelId?: number; // id канала, на странице которого мы находимся
}

export function VideoGrid({
  videos,
  className,
  currentChannelId,
}: VideoGridProps) {
  const [myChannelId, setMyChannelId] = useState<number | null>(null);
  useEffect(() => {
    apiClient
      .getMyChannel()
      .then((ch) => setMyChannelId(ch.id))
      .catch(() => setMyChannelId(null));
  }, []);

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("video.notFound")}</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className || ""}`}
    >
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          isOwner={
            myChannelId !== null &&
            currentChannelId !== null &&
            myChannelId === currentChannelId
          }
        />
      ))}
    </div>
  );
}

interface VideoCardProps {
  video: Video;
  isOwner?: boolean;
}

function VideoCard({ video }: VideoCardProps) {
  const videoTitle = video.video_title || video.title || t("video.untitled");
  const videoViews = video.video_views || video.views || 0;
  const videoDuration = video.duration_video || video.duration;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow relative">
      <div className="absolute bottom-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 p-0 bg-background/80 hover:bg-background"
            >
              <MoreVertical className="w-6 h-6 text-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t("video.addToQueue")}</DropdownMenuItem>
            <DropdownMenuItem>{t("video.saveToWatchLater")}</DropdownMenuItem>
            <DropdownMenuItem>{t("video.saveToPlaylist")}</DropdownMenuItem>
            <DropdownMenuItem>{t("video.download")}</DropdownMenuItem>
            <DropdownMenuItem>{t("video.share")}</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              {t("video.notInterested")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              {t("video.dontRecommendChannel")}
            </DropdownMenuItem>
            <DropdownMenuItem>{t("video.report")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Link href={`/watch?v=${video.id}`}>
        <CardContent className="p-0">
          <div className="relative aspect-video bg-muted">
            {video.thumbnail_path ? (
              <Image
                src={buildImageUrl(video.thumbnail_path)}
                alt={videoTitle}
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground text-sm">
                  {t("video.noPreview")}
                </span>
              </div>
            )}
            {videoDuration && (
              <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-1.5 py-0.5 rounded">
                {formatVideoDuration(video.duration ?? video.duration_video)}
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium line-clamp-2 text-sm leading-5 mb-1">
              {videoTitle}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>
                {videoViews} {t("video.views")}
              </span>
              <span>•</span>
              <span>{formatRelativeTimeIntl(video.created_at, getCurrentLanguage())}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
