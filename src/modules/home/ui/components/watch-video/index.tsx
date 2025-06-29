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

interface WatchVideoProps {
  videoId: string;
}

export const WatchVideo = ({ videoId }: WatchVideoProps) => {
    const router = useRouter();
    const { video, isLoading, error, refetch } = useVideo({ videoId });
    const { videos: recommendedVideos, isLoading: loadingRecommended } = useVideos();
    
    // Предзагружаем статистику для лучшего UX
    const { isLoading: isLoadingStats } = useVideoStats({ 
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Видео не найдено</h2>
                    <p className="text-muted-foreground">Видео с ID {videoId} не существует</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-6 max-w-[1920px] mx-auto p-4">
            {/* Primary Column - Video and Comments */}
            <div className="flex-1 max-w-5xl">
                {/* Loading indicator for stats */}
                {isLoadingStats && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center text-blue-700 text-sm">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            Loading video statistics...
                        </div>
                    </div>
                )}
                
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
                    commentsCount={video.commentsCount || 0}
                />
            </div>

            {/* Secondary Column - Recommendations */}
            <div className="w-80 xl:w-96">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Up next</h3>
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
                                            {recommendedVideo.views.toLocaleString()} views • {recommendedVideo.uploadedAt}
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