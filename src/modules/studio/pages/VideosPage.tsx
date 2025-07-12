"use client";
import { VideoTable } from "@/components/studio/Videos/VideoTable";
import { Button } from "@/components/ui/button";
import { mockVideos } from "@/lib/mock/studio-data";
import { t } from "@/lib/i18n";
import { Plus } from "lucide-react";
import Link from "next/link";

export function VideosPage() {
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

      <VideoTable videos={mockVideos} />
    </div>
  );
} 