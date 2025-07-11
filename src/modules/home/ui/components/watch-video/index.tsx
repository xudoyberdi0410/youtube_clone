"use client"

import { PrimaryColumn } from './primary-column'
import { useRouter } from 'next/navigation'
import { useVideo } from '@/hooks/use-video'
import { useVideos } from '@/hooks/use-videos'
import Image from 'next/image'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useVideoStats } from '@/hooks/use-video-stats'
import { RefreshCw } from "lucide-react"
import { t } from '@/lib/i18n';
import { formatRelativeTimeIntl } from '@/lib/utils/format';
import { getCurrentLanguage } from '@/lib/i18n';
import { VideoFilters } from '../home-videos/video-filters';
import React, { useRef, useState, useEffect } from 'react';

interface WatchVideoProps {
  videoId: string;
}

// Компонент с фильтрами и стрелками для горизонтального скролла
function SidebarVideoFiltersWithArrows() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const scrollBy = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full">
      {canScrollLeft && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-muted rounded-full p-1 shadow transition pointer-events-auto"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          onClick={() => scrollBy(-120)}
          aria-label="Scroll left"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      <div ref={scrollRef} className="overflow-x-auto scrollbar-none w-full">
        <div className="flex gap-2 min-w-max">
          <VideoFilters />
        </div>
      </div>
      {canScrollRight && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-muted rounded-full p-1 shadow transition pointer-events-auto"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          onClick={() => scrollBy(120)}
          aria-label="Scroll right"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
    </div>
  );
}

export const WatchVideo = ({ videoId }: WatchVideoProps) => {
    const router = useRouter();
    const { video, isLoading, error, refetch } = useVideo({ videoId });
    const { videos: recommendedVideos, isLoading: loadingRecommended } = useVideos();
    
    // Предзагружаем статистику для лучшего UX
    useVideoStats({ 
      videoId, 
      channelId: video?.channel?.id 
    });

    const onVideoSelect = (id: string) => {
      // Navigate to the selected video
      router.push(`/watch?v=${id}`);
    };

    if (error) {
        return (
            <div className="w-full max-w-screen-2xl mx-auto px-4 py-6">
                <Alert className="mb-6">
                    <AlertDescription className="flex items-center justify-between">
                        <span>Ошибка загрузки видео: {error}</span>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={refetch}
                            className="ml-4"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Повторить
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Показываем skeleton, пока идёт загрузка
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-80 max-w-full">
                  <div className="aspect-video bg-muted rounded-lg animate-pulse mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-2 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                </div>
            </div>
        );
    }

    // После загрузки, если видео не найдено
    if (!video) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">{t('video.notFoundTitle')}</h2>
                    <p className="text-muted-foreground">{t('video.notFound', { id: videoId })}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-6 max-w-[1920px] mx-auto p-4">
            {/* Primary Column - Video and Comments */}
            <div className="flex-1 max-w-5xl">
                
                <PrimaryColumn 
                    videoId={video.id}
                    title={video.title}
                    channelName={video.channel.name}
                    channelAvatar={video.channel.avatarUrl}
                    channelId={video.channel.id}
                    subscriberCount={video.channel.subscriberCount}
                    viewCount={video.views.toString()}
                    publishDate={video.uploadedAt}
                    description={video.description}
                    videoUrl={video.videoUrl}
                    likes={video.likes}
                    dislikes={video.dislikes}
                    isSubscribed={false}
                />
            </div>

            {/* Secondary Column - Recommendations */}
            <div className="w-80 xl:w-96">
                <div className="space-y-4">
                    {/* Video Filters */}
                    <div className="sticky top-0 z-10 bg-background pt-2 pb-1">
                      <SidebarVideoFiltersWithArrows />
                    </div>
                    {/* Recommended videos list */}
                    <div className="space-y-3">
                        {loadingRecommended ? (
                            // Loading skeleton
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex space-x-2 p-2">
                                    <div className="w-40 h-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            recommendedVideos
                                .filter(v => v.id !== video?.id) // Исключаем текущее видео
                                .map((recommendedVideo) => (
                                <div
                                    key={recommendedVideo.id}
                                    className="flex space-x-2 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                                    onClick={() => onVideoSelect(recommendedVideo.id)}
                                >
                                    <Image
                                        src={recommendedVideo.preview || '/previews/previews1.png'}
                                        alt={recommendedVideo.title}
                                        width={160}
                                        height={96}
                                        className="w-40 h-24 object-cover rounded-lg flex-shrink-0 bg-muted"
                                    />
                                    <div className="flex-1 space-y-1 overflow-hidden">
                                        <div className="font-medium text-sm text-foreground truncate">
                                            {recommendedVideo.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {recommendedVideo.channel.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {recommendedVideo.views.toLocaleString()} {t('video.views')} • {formatRelativeTimeIntl(recommendedVideo.uploadedAt, getCurrentLanguage())}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}