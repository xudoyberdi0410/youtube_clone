"use client";
import { SearchResultCard } from "./SearchResultCard";
import { VideoRowList } from '@/components/video/VideoRowList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { t } from '@/lib/i18n';
import { formatVideoDuration, formatRelativeTimeIntl } from '@/lib/utils/format';
import { getCurrentLanguage } from '@/lib/i18n';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { UniversalVideoCard } from '@/components/video/UniversalVideoCard';

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