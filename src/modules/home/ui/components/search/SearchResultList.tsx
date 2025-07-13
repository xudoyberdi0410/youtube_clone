"use client";
import { UniversalVideoCard } from '@/components/video/UniversalVideoCard';
import { t } from '@/lib/i18n';

interface Channel {
  id: string;
  name: string;
  avatarUrl: string;
  isVerified?: boolean;
}

interface Video {
  id: string;
  title: string;
  description: string;
  views: number;
  channel: Channel;
  preview: string;
  videoUrl?: string;
  duration: string;
  uploadedAt: string;
}

interface SearchResultListProps {
  videos: Video[];
}

export function SearchResultList({ videos }: SearchResultListProps) {
  return (
    <div className="flex flex-col gap-6">
      {videos.map((video) => (
        <UniversalVideoCard
          key={video.id}
          id={video.id}
          title={video.title}
          description={video.description}
          views={video.views}
          channel={{ name: video.channel.name, avatarUrl: video.channel.avatarUrl, isVerified: video.channel.isVerified, link: `/channel?name=${encodeURIComponent(video.channel.name)}` }}
          preview={video.preview}
          videoUrl={video.videoUrl}
          duration={video.duration}
          uploadedAt={video.uploadedAt}
          showMenu={true}
          menuItems={[
            { label: t('video.share') },
            { label: t('video.saveToPlaylist') },
          ]}
        />
      ))}
    </div>
  );
} 