"use client";
import { SearchResultCard } from "./SearchResultCard";

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
    <div className="flex flex-col gap-3">
      {videos.map((video) => (
        <SearchResultCard key={video.id} {...video} />
      ))}
    </div>
  );
} 