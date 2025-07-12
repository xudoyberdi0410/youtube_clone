"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Edit, Eye } from "lucide-react";
import { t } from "@/lib/i18n";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  status: 'draft' | 'published' | 'processing';
  views: number;
  uploadedAt: string;
}

interface RecentUploadsProps {
  videos: Video[];
}

export function RecentUploads({ videos }: RecentUploadsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (videos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {t('studio.recentUploads')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('studio.noVideos')}</p>
            <Button className="mt-4" asChild>
              <Link href="/studio/upload">
                {t('studio.addVideo')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          {t('studio.recentUploads')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {videos.slice(0, 3).map((video) => (
            <div key={video.id} className="flex gap-3 p-3 rounded-lg border">
              <div className="relative w-24 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={96}
                  height={56}
                  className="w-24 h-14 object-cover rounded-lg"
                />
                {video.status === 'processing' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm line-clamp-1">{video.title}</h4>
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(video.status)}
                  >
                    {t(`studio.videoStatus.${video.status}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {video.views.toLocaleString()} {t('video.views')} • {formatDistanceToNow(new Date(video.uploadedAt), { addSuffix: true })}
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-6 px-2" asChild>
                    <Link href={`/studio/videos/${video.id}/edit`}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  {video.status === 'published' && (
                    <Button variant="ghost" size="sm" className="h-6 px-2" asChild>
                      <Link href={`/watch?v=${video.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 