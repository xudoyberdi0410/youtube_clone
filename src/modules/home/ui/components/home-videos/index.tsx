"use client"; // обязательно, чтобы можно было использовать useState/useEffect

import { VideoCardSkelton } from "./video-card-skelton";
import { VideoCard } from "./video-card";
import { VideoFilters } from "./video-filters";
import { EmptyState } from "./empty-state";
import { LoadingMore } from "./loading-more";
import { LoadMoreIndicator } from "./load-more-indicator";
import { useInfiniteVideos } from "@/hooks/use-infinite-videos";
import { useInfiniteScroll } from "./use-infinite-scroll";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { t } from "@/lib/i18n";

export default function HomeVideos() {
    const { 
        videos, 
        isLoading, 
        isLoadingMore, 
        error, 
        hasMore, 
        refetch, 
        changeCategory,
        loadMore 
    } = useInfiniteVideos();

    const loadMoreRef = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore,
        isLoading: isLoadingMore,
    });

    if (error) {
        return (
            <div className="w-full max-w-screen-2xl mx-auto px-4 py-6">
                <Alert className="mb-6">
                    <AlertDescription className="flex items-center justify-between">
                        <span>{t('home.errorLoadingVideos')} {error}</span>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={refetch}
                            className="ml-4"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            {t('home.retry')}
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="w-full">
            <VideoFilters onCategoryChange={changeCategory} />
            
            <div className="w-full max-w-screen-2xl mx-auto px-4 py-6">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                        {Array.from({ length: 12 }).map((_, i) => <VideoCardSkelton key={i} />)}
                    </div>
                ) : videos.length === 0 ? (
                    <EmptyState onRefresh={refetch} />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                            {videos.map((video) => (<VideoCard {...video} key={video.id} />))}
                        </div>
                        
                        {/* Элемент для отслеживания прокрутки */}
                        <div ref={loadMoreRef} className="mt-6">
                            {isLoadingMore && <LoadingMore />}
                            <LoadMoreIndicator isLoading={isLoadingMore} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
