"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { buildImageUrl } from "@/lib/api-config";
import { formatApiDate, formatVideoDuration } from "@/lib/utils/format";
import type { Video, VideoCategory } from "@/types/api";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoEditForm } from "@/modules/upload/ui/components/video-edit-form";
import { apiClient } from "@/lib/api-client";
import { t } from "@/lib/i18n";

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

function VideoCard({ video, isOwner }: VideoCardProps) {
  const videoTitle = video.video_title || video.title || t("video.untitled");
  const videoViews = video.video_views || video.views || 0;
  const videoDuration = video.duration_video || video.duration;

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  const handleEditSubmit = async (data: {
    title: string;
    description: string;
    category: VideoCategory;
  }) => {
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);
    try {
      await apiClient.updateVideo({
        title: data.title,
        description: data.description,
        category: data.category,
      });
      setEditSuccess(true);
      setTimeout(() => setEditOpen(false), 1000);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow relative">
      {isOwner && (
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
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                {t("video.edit")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
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
              <span>{formatApiDate(video.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Link>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("video.editTitle")}</DialogTitle>
          </DialogHeader>
          <VideoEditForm
            initialTitle={video.video_title || video.title || ""}
            initialDescription={
              video.video_description || video.description || ""
            }
            initialCategory={video.category}
            onSubmit={handleEditSubmit}
            loading={editLoading}
            error={editError}
            success={editSuccess}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
