"use client";
import { VideoTable } from "@/components/studio/Videos/VideoTable";
import { Button } from "@/components/ui/button";
import { useMyVideos } from "@/hooks/use-videos";
import { t } from "@/lib/i18n";
import { Plus } from "lucide-react";
import Link from "next/link";

export function VideosPage() {
  const { videos, isLoading, error } = useMyVideos();

  // Map API videos to VideoTable format
  const tableVideos = videos.map((video) => ({
    id: video.id,
    title: video.title,
    thumbnail: video.preview,
    duration: video.duration,
    status: 'published' as const, // always published for now
    views: video.views,
    likes: video.likes ?? 0,
    uploadedAt: video.uploadedAt,
    visibility: 'public' as const, // always public for now
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('studio.videos')}</h1>
          <p className="text-muted-foreground">
            Manage your videos, edit details, and track performance.
          </p>
        </div>
        <Button asChild>
          <Link href="/studio/upload">
            <Plus className="h-4 w-4 mr-2" />
            {t('studio.addVideo')}
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">{t('loading')}</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <VideoTable videos={tableVideos} />
      )}
    </div>
  );
} 