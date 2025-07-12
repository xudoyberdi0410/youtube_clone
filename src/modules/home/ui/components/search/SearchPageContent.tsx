"use client";
import { t } from "@/lib/i18n";
import { SearchResultList } from "./SearchResultList";

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

interface SearchPageContentProps {
  query: string;
  videos: Video[];
}

export function SearchPageContent({ query, videos }: SearchPageContentProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        {t('search.resultsFor', { query })}
      </h1>
      <SearchResultList videos={videos} />
    </div>
  );
} 